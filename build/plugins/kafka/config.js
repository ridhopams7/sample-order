"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafkaConfig = void 0;
const kafkaConfig = (server) => ({
    kafkaHost: server.conf.kafkaHost,
    autoConnect: true,
    reconnectOnIdle: true,
});
exports.kafkaConfig = kafkaConfig;
//# sourceMappingURL=config.js.map