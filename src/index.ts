import { FastifyInstance } from "fastify";
import { createServer } from './server'

createServer()
    .then((server: any) => {
        server.log.info('Server started');
        // check status plugin
        server.redis.set('test', 'Connected', "EX", server.conf.expireToken, (err, val) => {
            if (err) {
                server.log.info('Failed to establish Redis Connection.');
                server.log.error(JSON.stringify(err));
            } else {
                server.log.info('Redis Connection has been established successfully.');
            }
        });

         // running kafka monitor

         server.kafkaClient.on('ready', () => {
             server.log.info('Kafka Client Connection has been established successfully.');
         });
         server.kafkaClient.on('error', (err) => {
             server.log.info('Server not connected to Kafka');
         });
     


        const apmServerStatus = server.apm.isStarted();
        if (apmServerStatus) {
            server.log.info('Server connected to APM Server');
        } else {
            server.log.info('Server not connected to APM Server');
        }

    }).catch(error => {
        // do something
        console.log(error);
    });

