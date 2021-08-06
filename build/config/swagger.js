"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const options = {
    routePrefix: '/swagger',
    swagger: {
        info: {
            title: 'API Documentation',
            description: 'API Documentation',
            version: '0.1.0'
        },
        securityDefinitions: {
            APIKeyHeader: {
                type: 'apiKey',
                name: 'Authorization',
                description: "Value: Bearer <Token>",
                in: 'header'
            }
        },
        schemes: ['http', 'https'],
        consumes: ['application/json'],
        produces: ['application/json'],
        security: [
            {
                APIKeyHeader: []
            },
        ]
    },
    hideUntagged: true,
    exposeRoute: true
};
exports.default = {
    options,
};
//# sourceMappingURL=swagger.js.map