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
const kafka_node_1 = require("kafka-node");
const config_1 = require("./config");
const kafkaPlugin = ((server, opts, next) => __awaiter(void 0, void 0, void 0, function* () {
    let config = config_1.kafkaConfig(server);
    const client = new kafka_node_1.KafkaClient(config);
    // decorators
    server.decorate('kafkaClient', client);
}));
exports.default = fastify_plugin_1.default(kafkaPlugin);
//# sourceMappingURL=index.js.map