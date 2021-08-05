"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const sequelize_1 = __importDefault(require("sequelize"));
const schema_1 = require("./schema");
const users_1 = require("../../../plugins/db/models/users");
const user_service_1 = require("../../services/user-service");
exports.default = fastify_plugin_1.default((server, opts, next) => {
    server.post("/user/model/insert", { schema: schema_1.UserTO }, (request, reply) => {
        try {
            // const login = server.decoded.username;
            const { username, password } = request.body;
            if (username && password) {
                user_service_1.insert(server, request.body)
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
            }
            else {
                return reply.code(400).send({
                    success: false,
                    message: 'Insert failed! Please check the request'
                });
            }
        }
        catch (error) {
            request.log.error(error);
            return reply.send(400);
        }
    });
    server.post("/user/insert", { schema: schema_1.UserTO }, (request, reply) => {
        try {
            const { username, password, email, address } = request.body;
            if (username && password) {
                const query = `INSERT INTO [dbo].[USERS] ([Username],[Password], [Email],[Address],[CreatedBy],[CreatedDate])
                     VALUES('${username}', '${password}', '${email}', '${address}', 'test', GETDATE())`;
                server.db.query(query, {
                    type: sequelize_1.default.QueryTypes.INSERT
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
            }
            else {
                return reply.code(400).send({
                    success: false,
                    message: 'Insert failed! Please check the request'
                });
            }
        }
        catch (error) {
            request.log.error(error);
            return reply.send(400);
        }
    });
    server.get("/user/model/getAll", { schema: schema_1.GetUserTO }, (request, reply) => {
        try {
            const userDb = users_1.UserFactory(server.db);
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
    next();
});
//# sourceMappingURL=index.js.map