"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafkaSubscribe = void 0;
const kafka_node_1 = require("kafka-node");
const config_1 = require("./config");
/**
 * Kafka Consumer
 */
const kafkaSubscribe = (server, topic, send) => {
    const topics = [{ topic: topic, partition: 0 }];
    const options = { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 };
    const client = new kafka_node_1.KafkaClient(config_1.kafkaConfig(server));
    const consumer = new kafka_node_1.Consumer(client, topics, options);
    consumer.on('error', (err) => {
        console.log('error', err);
    });
    client.refreshMetadata([topic], (err) => {
        const offset = new kafka_node_1.Offset(client);
        if (err) {
            throw err;
        }
        consumer.on('message', (message) => {
            send(message);
        });
        /*
         * If consumer get `offsetOutOfRange` event, fetch data from the smallest(oldest) offset
         */
        consumer.on('offsetOutOfRange', (topicRequest) => {
            offset.fetch([topicRequest], function (error, offsets) {
                if (error) {
                    return console.error(error);
                }
                const min = Math.min.apply(null, offsets[topicRequest.topic][topicRequest.partition]);
                consumer.setOffset(topicRequest.topic, topicRequest.partition, min);
            });
        });
    });
};
exports.kafkaSubscribe = kafkaSubscribe;
//# sourceMappingURL=consumer.js.map