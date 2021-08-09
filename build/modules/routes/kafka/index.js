"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const schema_1 = require("./schema");
const consumer_1 = require("../../../plugins/kafka/consumer");
const producer_1 = require("../../../plugins/kafka/producer");
exports.default = fastify_plugin_1.default((server, opts, next) => {
    server.post("/kafka/subscribe", { schema: schema_1.SubscribeKafkaTO }, (request, reply) => {
        try {
            const { topic } = request.body;
            let count = 0;
            let data = [];
            consumer_1.kafkaSubscribe(server.kafkaClient, topic, (messages) => {
                count++;
                data.push(messages);
                if (count == messages.highWaterOffset) {
                    return reply.code(200).send({
                        success: true,
                        message: 'Inquiry successful!',
                        data
                    });
                }
            });
        }
        catch (error) {
            server.apm.captureError({
                method: request.routerMethod,
                path: request.routerPath,
                param: request.body,
                error,
            });
            request.log.error(error);
            return reply.send(400);
        }
    });
    server.post("/kafka/publish", { schema: schema_1.PublishKafkaTO }, (request, reply) => {
        const { topic, messages } = request.body;
        producer_1.publish(server.kafkaClient, topic, messages).then((response) => {
            return reply.code(200).send({
                success: true,
                message: 'Send message successful!',
                data: response
            });
        }).catch((error) => {
            server.apm.captureError(JSON.stringify({
                method: request.routerMethod,
                path: request.routerPath,
                param: request.body,
                error,
            }));
            return reply.code(400).send({
                success: true,
                message: 'Send message failed!',
                data: error
            });
        });
    });
    server.post("/kafka/createTopic", { schema: schema_1.TopicKafkaTO }, (request, reply) => {
        const { topics } = request.body;
        producer_1.createTopic(server.kafkaClient, topics).then((response) => {
            return reply.code(200).send({
                success: true,
                message: 'Create topic successful!',
                data: response
            });
        }).catch((error) => {
            server.apm.captureError({
                method: request.routerMethod,
                path: request.routerPath,
                param: request.body,
                error,
            });
            return reply.code(400).send({
                success: true,
                message: 'Create topic failed!',
                data: error
            });
        });
    });
    next();
});
//# sourceMappingURL=index.js.map