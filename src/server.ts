import { fastify } from "fastify";
import fastifyBlipp from "fastify-blipp";
import fastifySwagger from "fastify-swagger";
import AutoLoad from "fastify-autoload";
import fastifyJwt from "fastify-jwt";

import apmServer from 'elastic-apm-node';

import { swagger } from './config';

import * as path from "path";
import * as dotenv from "dotenv";

import dbPlugin from './plugins/db';
import redisPlugin from './plugins/redis';
import kafkaPlugin from './plugins/kafka';
import authPlugin from './plugins/auth';

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

const secretKey: string = process.env.SECRET;
const expireToken = process.env.EXPIRE_TOKEN;

const redisPort: any = process.env.REDIS_PORT;
const redistHost: string = process.env.REDIS_HOST

const kafkaHost: string = process.env.KAFKA_HOST

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

    // decorators
    server.decorate('conf', { port, secretKey, expireToken, redisPort, redistHost, apmUrl, dbDialect, db, dbHost, dbPort, dbUsername, dbPassword, kafkaHost })
    // apm
    server.decorate('apm', apmServer)

    // jwt
    server.register(fastifyJwt, { secret: secretKey })
    // swagger / open api
    server.register(fastifySwagger, swagger.options)
    // auto register all routes
    server.register(AutoLoad, {
        dir: path.join(__dirname, "modules/routes")
    })

    server.get('/', async (request, reply) => {
        return {
            hello: 'world'
        }
    });

    // plugin 
    server.register(dbPlugin)
    server.register(redisPlugin)
    server.register(authPlugin);
    server.register(kafkaPlugin);


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
