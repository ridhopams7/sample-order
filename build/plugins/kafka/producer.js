"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTopic = exports.publish = void 0;
const kafka_node_1 = require("kafka-node");
const config_1 = require("./config");
/**
 * Kafka Producer
 */
const publish = (server, topic, message) => new Promise((resolve, rejects) => {
    // The producer handles publishing messages over a topic
    const client = new kafka_node_1.KafkaClient(config_1.kafkaConfig(server));
    const producer = new kafka_node_1.Producer(client);
    // First wait for the producer to be initialized
    producer.on('ready', () => {
        // Update metadata for the topic we'd like to publish to
        client.refreshMetadata([topic], (err) => {
            if (err) {
                // throw err;
                rejects(err);
            }
            console.log(`Sending message to ${topic}: ${message}`);
            producer.send([{ topic, messages: [message] }], (error, result) => {
                console.log(error || result);
                if (result) {
                    resolve(result);
                }
                if (error) {
                    rejects(error);
                }
            });
        });
    });
    producer.on('error', (err) => {
        rejects(err);
    });
});
exports.publish = publish;
const createTopic = (client, topic) => new Promise((resolve, rejects) => {
    const producer = new kafka_node_1.Producer(client);
    // First wait for the producer to be initialized
    // producer.on('ready', () => {
    console.log(`Create topic ${topic}`);
    producer.createTopics(topic, (error, data) => {
        console.log(error || data);
        if (data) {
            resolve(data);
        }
        if (error) {
            rejects(error);
        }
    });
    // });
    producer.on('error', (err) => {
        rejects(err);
    });
});
exports.createTopic = createTopic;
//# sourceMappingURL=producer.js.map