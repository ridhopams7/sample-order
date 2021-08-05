"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dbSequel = __importStar(require("sequelize"));
const models_1 = require("./models");
const dbPlugin = (server, opts, next) => __awaiter(void 0, void 0, void 0, function* () {
    // database
    const dbSequelize = new dbSequel.Sequelize(server.conf.db, server.conf.dbUsername, server.conf.dbPassword, {
        // other sequelize config goes here
        dialect: server.conf.dbDialect,
        host: server.conf.dbHost,
        port: Number.parseInt(server.conf.dbPort),
        dialectOptions: {
            options: { encrypt: false }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
    // // SOMETHING VERY IMPORTANT them Factory functions expect a
    // // sequelize instance as parameter give them `dbSequelize`
    // export const User = UserFactory(dbSequelize);
    // export const Skills = SkillsFactory(dbSequelize);
    // decorators
    server.decorate('db', dbSequelize);
    server.addHook('onClose', (fastifyInstance, done) => {
        dbSequelize.close()
            .then(() => done())
            .catch((error) => {
            const { message, stack } = error;
            const err = {
                method: 'DB Connection Closing',
                message,
                stack
            };
            server.apm.captureError(JSON.stringify(err));
            done();
        });
    });
    server.log.info('Checking Connection.');
    const authDB = yield server.db.authenticate();
    if (authDB) {
        server.apm.captureError({
            method: 'Connecting to database',
            error: authDB
        });
        server.log.error('Unable to connect to the database:', authDB);
    }
    server.log.info('Database Connection has been established successfully.');
    const skill = models_1.SkillsFactory(dbSequelize);
    const user = models_1.UserFactory(dbSequelize);
    const order = models_1.OrdersFactory(dbSequelize);
    const orderDetail = models_1.OrderDetailsFactory(dbSequelize);
    // await skill.sync({ force: true })
    // server.db.sync({ force: true });
    // server.db.sync();
});
exports.default = fastify_plugin_1.default(dbPlugin);
//# sourceMappingURL=index.js.map