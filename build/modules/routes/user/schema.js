"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserTO = exports.UserTO = exports.VerifyTokenTO = exports.LoginTO = void 0;
exports.LoginTO = {
    description: 'Login',
    tags: ['auth'],
    summary: 'Login using username and password',
    body: {
        type: 'object',
        properties: {
            username: { type: 'string' },
            password: { type: 'string' },
        }
    },
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                token: { type: 'string' },
            }
        }
    }
};
exports.VerifyTokenTO = {
    description: 'verifyToken',
    tags: ['auth'],
    summary: 'Verify Token',
    body: {
        type: 'object',
        properties: {
            token: { type: 'string' },
        }
    },
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                payload: { type: 'string' },
            }
        }
    }
};
exports.UserTO = {
    description: 'UserDetail',
    tags: ['User'],
    summary: 'User',
    body: {
        type: 'object',
        properties: {
            username: { type: 'string' },
            password: { type: 'string' },
            email: { type: 'string' },
            address: { type: 'string' },
        }
    },
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                success: { type: 'string' },
                message: { type: 'string' },
                data: {
                    username: { type: 'string' },
                    password: { type: 'string' },
                    createdBy: { type: 'string' },
                }
            }
        }
    }
};
exports.GetUserTO = {
    description: 'UserDetail',
    tags: ['User'],
    summary: 'User',
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                success: { type: 'string' },
                message: { type: 'string' },
                data: {
                    username: { type: 'string' },
                    password: { type: 'string' },
                    createdBy: { type: 'string' },
                }
            }
        }
    }
};
//# sourceMappingURL=schema.js.map