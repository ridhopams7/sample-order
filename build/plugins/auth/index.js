"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const utils_1 = require("../../utils");
const authPlugin = (server, opts, next) => {
    server.decorate('decoded', null);
    server.addHook('preHandler', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (request.routerPath) {
                if (!request.routerPath.includes('swagger') && !request.routerPath.includes('login')) {
                    const authHeader = request.headers.authorization;
                    const token = authHeader.split(' ')[1];
                    server.jwt.verify(token, (err, decodedJwt) => {
                        if (err) {
                            utils_1.sendApmError(server, request, err);
                            server.log.error(err);
                        }
                        else {
                            server.log.info('decoded : ' + JSON.stringify(decodedJwt));
                            server.decoded = decodedJwt;
                            next();
                        }
                    });
                }
            }
        }
        catch (err) {
            utils_1.sendApmError(server, request, err);
            throw new Error('Failed to validate token');
        }
    }));
    next();
};
exports.default = fastify_plugin_1.default(authPlugin);
//# sourceMappingURL=index.js.map