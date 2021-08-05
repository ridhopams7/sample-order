import { fastify } from "fastify";
import fastifyBlipp from "fastify-blipp";
import fastifySwagger from "fastify-swagger";
import AutoLoad from "fastify-autoload";

import apmServer from 'elastic-apm-node';

import * as path from "path";
import * as dotenv from "dotenv";

import dbPlugin from './plugins/db';

dotenv.config({
    path: path.resolve(".env")
})

// configuration
const port: any = process.env.PORT;

const dbDialect: string = process.env.DB_DIALECT
const db: string = process.env.DB
const dbHost: string = process.env.DB_HOST
const dbPort: any = process.env.DB_PORT
const dbUsername: string = process.env.DB_USERNAME
const dbPassword: string = process.env.DB_PASSWORD

const apmUrl: string = process.env.APM_URL;

var apm = apmServer.start({
    // Override service name from package.json
    serviceName: 'apm-server',

    // Set custom APM Server URL (default: http://localhost:8200)
    serverUrl: apmUrl,
})

export const createServer = () => new Promise((resolve, reject) => {

    const server = fastify({
        ignoreTrailingSlash: true,
        logger: {
            prettyPrint: true,
            level: "info",
        },
        bodyLimit: 15000 * 1024,
        pluginTimeout: 12000
    })

    //-------------------------------------------
    // register plugin below:
    server.register(fastifyBlipp)

    // swagger / open api
    server.register(fastifySwagger, {
        routePrefix: '/swagger',
        swagger: {
            info: {
                title: 'API Documentation',
                description: 'API Documentation',
                version: '0.1.0'
            },
            securityDefinitions: {
                APIKeyHeader: {
                    type: 'apiKey',
                    name: 'Authorization',
                    description: "value: Bearer <Token>",
                    in: 'header'
                }
            },
            schemes: ['http', 'https'],
            consumes: ['application/json'],
            produces: ['application/json'],
            security: [
                {
                    APIKeyHeader: []
                }
            ]
        },
        hideUntagged: true,
        exposeRoute: true
    })

    // auto register all routes
    server.register(AutoLoad, {
        dir: path.join(__dirname, "modules/routes")
    })

    server.get('/', async (request, reply) => {
        return {
            hello: 'world'
        }
    });

    // decorators
    server.decorate('conf', { port, dbDialect, db, dbHost, dbPort, dbUsername, dbPassword })
    // apm
    server.decorate('apm', apmServer)


    // plugin 
    server.register(dbPlugin)


    //-----------------------------------------------------
    server.addHook('onRequest', async (request, reply, error) => {
        apm.setTransactionName(request.method + ' ' + request.url);
    });

    // global hook error handling for unhandled error
    server.addHook('onError', async (request, reply, error) => {
        const { message, stack } = error;
        let err = {

            method: request.routerMethod,
            path: request.routerPath,
            param: request.body,
            message,
            stack
        };

        apm.captureError(JSON.stringify(err));
    });


    //main 
    const start = async () => {
        try {
            await server.listen(port)
            server.blipp();
            server.log.info(`server listening on ${JSON.stringify(server.server.address())}`);
            resolve(server);
        } catch (err) {
            server.log.error(err);
            reject(err);
            process.exit(1);
        }
    }

    start();
})
