
import fp from 'fastify-plugin'
import { KafkaClient, KafkaClientOptions } from 'kafka-node';

import { kafkaConfig } from './config';

const kafkaPlugin = (async (server, opts, next) => {

    let config: KafkaClientOptions = kafkaConfig(server);
    const client = new KafkaClient(config);

    // decorators
    server.decorate('kafkaClient', client);

});

export default fp(kafkaPlugin);