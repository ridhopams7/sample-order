import fp from 'fastify-plugin';
import Sequelize from 'sequelize'
import { OrderTO, UpdateOrder, GetOrderList, DeleteOrder } from './schema';
import { OrderService } from '../../services/order-service';


export default fp((server, opts, next) => {

    server.post("/order/insert", { schema: OrderTO }, (request, reply) => {
        try {
            // const login = server.decoded.username;
            const orderService = new OrderService(server.db);
            const username = server.decoded.username;
            console.log(username)

            orderService.inputOrder({ request: request.body })
                .then(data => {
                    return reply.code(200).send({
                        success: true,
                        message: 'Insert successful!',
                        data,
                    });
                }).catch(err => {
                    return reply.code(400).send({
                        success: false,
                        message: 'Error in insert new record',
                        err,
                    });
                });


        } catch (error) {

            request.log.error(error);
            return reply.send(400);
        }
    });

    server.post("/order/update", { schema: UpdateOrder }, (request, reply) => {
        try {
            const orderService = new OrderService(server.db);

            orderService.updateOrderDetail({ request: request.body }).then(data => {
                return reply.code(200).send({
                    responseCode: 200,
                    message: 'Success',
                    result: data
                });
            }).catch(err => {

                return reply.code(400).send({
                    success: false,
                    message: 'Error showing transaction list',
                    data: err,
                    err,
                });
            });

        } catch (error) {

            request.log.error(error);
            return reply.send(400);
        }
    });

    server.post("/order/orderlist", { schema: GetOrderList }, (request, reply) => {
        try {
            const orderService = new OrderService(server.db);
            orderService.getOrderList({ request: request.body, }).then((result: any) => {
                console.log(result)
                return reply.code(200).send({
                    responseCode: 200,
                    message: 'Success',
                    result: result.data,
                    totalData: result.totalData,
                });

            }).catch(err => {

                return reply.code(400).send({
                    success: false,
                    message: 'Error showing transaction list',
                    data: err,
                    error: err,
                });
            });

        } catch (error) {

            request.log.error(error);
            return reply.send(400);
        }
    });

    server.post("/order/delete", { schema: DeleteOrder }, (request, reply) => {
        try {

            const orderService = new OrderService(server.db);
            orderService.deleteOrder({ request: request.body}).then((result: any) => {
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

        } catch (error) {

            request.log.error(error);
            return reply.send(400);
        }
    });

    next();
});