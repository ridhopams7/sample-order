import fp from 'fastify-plugin';
import Sequelize from 'sequelize'
import { UserTO, GetUserTO } from './schema';
import { UserFactory, UsersAttributes } from '../../../plugins/db/models/users';
import { insert } from '../../services/user-service';


export default fp((server, opts, next) => {

    server.post("/user/model/insert", { schema: UserTO }, (request, reply) => {
        try {
            // const login = server.decoded.username;
            const { username, password } = request.body;

            if (username && password) {
                insert(server, request.body)
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
            } else {
                return reply.code(400).send({
                    success: false,
                    message: 'Insert failed! Please check the request'
                });
            }

        } catch (error) {

            request.log.error(error);
            return reply.send(400);
        }
    });

    server.post("/user/insert", { schema: UserTO }, (request, reply) => {
        try {
            const { username, password, email, address } = request.body;

            if (username && password) {
                const query = `INSERT INTO [dbo].[USERS] ([Username],[Password], [Email],[Address],[CreatedBy],[CreatedDate])
                     VALUES('${username}', '${password}', '${email}', '${address}', 'test', GETDATE())`;

                server.db.query(query, {
                    type: Sequelize.QueryTypes.INSERT
                }).then(data => {
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

            } else {
                return reply.code(400).send({
                    success: false,
                    message: 'Insert failed! Please check the request'
                });
            }

        } catch (error) {
            request.log.error(error);
            return reply.send(400);
        }
    });

    server.get("/user/model/getAll", { schema: GetUserTO }, (request, reply) => {
        try {

            const userDb = UserFactory(server.db);

            userDb.findAndCountAll()
                .then(data => {
                    return reply.code(200).send({
                        success: true,
                        message: 'Inquiry successful!',
                        data
                    });
                }).catch(err => {
                    return reply.code(400).send({
                        success: false,
                        message: 'Error in Inquiry',
                        data: err,
                    });
                });


        } catch (error) {
            server.apm.captureError({
                method: request.routerMethod,
                path: request.routerPath,
                param: request.body,
                error,
            })

            request.log.error(error);
            return reply.send(400);
        }
    });


    next();
});