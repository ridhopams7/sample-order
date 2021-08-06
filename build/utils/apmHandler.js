"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendApmErrorString = exports.sendApmError = void 0;
const sendApmError = (server, request, error) => {
    const { message, stack } = error;
    const err = {
        method: request.routerMethod,
        path: request.routerPath,
        param: request.body,
        message,
        stack
    };
    server.apm.captureError(err);
};
exports.sendApmError = sendApmError;
const sendApmErrorString = (server, error) => {
    server.apm.captureError(error);
};
exports.sendApmErrorString = sendApmErrorString;
//# sourceMappingURL=apmHandler.js.map