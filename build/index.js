"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
server_1.createServer()
    .then((server) => {
    server.log.info('Server started');
    // check status plugin
    server.redis.set('test', 'Connected', "EX", server.conf.expireToken, (err, val) => {
        if (err) {
            server.log.info('Failed to establish Redis Connection.');
            server.log.error(JSON.stringify(err));
        }
        else {
            server.log.info('Redis Connection has been established successfully.');
        }
    });
    const apmServerStatus = server.apm.isStarted();
    if (apmServerStatus) {
        server.log.info('Server connected to APM Server');
    }
    else {
        server.log.info('Server not connected to APM Server');
    }
}).catch(error => {
    // do something
    console.log(error);
});
//# sourceMappingURL=index.js.map