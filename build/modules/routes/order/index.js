"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const schema_1 = require("./schema");
const order_service_1 = require("../../services/order-service");
const utils_1 = require("../../../utils");
exports.default = fastify_plugin_1.default((server, opts, next) => {
    server.post("/order/insert", { schema: schema_1.OrderTO }, (request, reply) => {
        try {
            // const login = server.decoded.username;
            const orderService = new order_service_1.OrderService(server.db);
            const username = server.decoded.username;
            console.log(username);
            orderService.inputOrder({ request: request.body })
                .then(data => {
                return reply.code(200).send({
                    success: true,
                    message: 'Insert successful!',
                    data,
                });
            }).catch(err => {
                utils_1.sendApmError(server, request, err);
                return reply.code(400).send({
                    success: false,
                    message: 'Error in insert new record',
                    err,
                });
            });
        }
        catch (error) {
            utils_1.sendApmError(server, request, error);
            request.log.error(error);
            return reply.send(400);
        }
    });
    server.post("/order/update", { schema: schema_1.UpdateOrder }, (request, reply) => {
        try {
            const orderService = new order_service_1.OrderService(server.db);
            orderService.updateOrderDetail({ request: request.body }).then(data => {
                return reply.code(200).send({
                    responseCode: 200,
                    message: 'Success',
                    result: data
                });
            }).catch(err => {
                utils_1.sendApmError(server, request, err);
                return reply.code(400).send({
                    success: false,
                    message: 'Error showing transaction list',
                    data: err,
                    err,
                });
            });
        }
        catch (error) {
            utils_1.sendApmError(server, request, error);
            request.log.error(error);
            return reply.send(400);
        }
    });
    server.post("/order/orderlist", { schema: schema_1.GetOrderList }, (request, reply) => {
        try {
            const orderService = new order_service_1.OrderService(server.db);
            orderService.getOrderList({ request: request.body, }).then((result) => {
                console.log(result);
                return reply.code(200).send({
                    responseCode: 200,
                    message: 'Success',
                    result: result.data,
                    totalData: result.totalData,
                });
            }).catch(err => {
                utils_1.sendApmError(server, request, err);
                return reply.code(400).send({
                    success: false,
                    message: 'Error showing transaction list',
                    data: err,
                    error: err,
                });
            });
        }
        catch (error) {
            utils_1.sendApmError(server, request, error);
            request.log.error(error);
            return reply.send(400);
        }
    });
    server.post("/order/delete", { schema: schema_1.DeleteOrder }, (request, reply) => {
        try {
            const orderService = new order_service_1.OrderService(server.db);
            orderService.deleteOrder({ request: request.body }).then((result) => {
                return reply.code(200).send({
                    responseCode: 200,
                    message: 'Success',
                    result
                });
            }).catch(err => {
                return reply.code(400).send({
                    success: false,
                    message: 'Error showing transaction list',
                    data: err,
                    error: err,
                });
            });
        }
        catch (error) {
            request.log.error(error);
            return reply.send(400);
        }
    });
    next();
});
//# sourceMappingURL=index.js.map