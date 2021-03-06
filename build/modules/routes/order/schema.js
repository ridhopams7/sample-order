"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteOrder = exports.GetOrderList = exports.UpdateOrder = exports.OrderTO = void 0;
exports.OrderTO = {
    description: 'OrderList',
    tags: ['Order'],
    summary: 'Order',
    body: {
        type: 'object',
        properties: {
            status: { type: 'string' },
            paymentType: { type: 'string' },
            orderDetail: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        productId: { type: 'number' },
                        category: { type: 'string' },
                        quantity: { type: 'number' },
                        price: { type: 'number' },
                    }
                },
            },
        }
    },
    response: {
        200: {
            description: 'Successful',
            type: 'object',
            properties: {
                responseCode: { type: 'number' },
                message: { type: 'string' },
                result: {
                    type: 'object',
                    properties: {
                        orderNo: { type: 'string' },
                        status: { type: 'string' },
                    }
                }
            }
        }
    }
};
exports.UpdateOrder = {
    description: 'OrderList',
    tags: ['Order'],
    summary: 'Order',
    body: {
        type: 'object',
        properties: {
            orderNo: { type: 'string' },
            status: { type: 'string' },
        }
    },
    response: {
        200: {
            description: 'Successful',
            type: 'object',
            properties: {
                responseCode: { type: 'number' },
                message: { type: 'string' },
                result: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        orderNo: { type: 'string' },
                        status: { type: 'string' },
                        orderDetail: {
                            type: 'array',
                            properties: {
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'number' },
                                        productId: { type: 'number' },
                                        category: { type: 'string' },
                                        price: { type: 'number' },
                                        quantity: { type: 'number' },
                                        totalPrice: { type: 'number' },
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
exports.GetOrderList = {
    description: 'OrderList',
    tags: ['Order'],
    summary: 'Order',
    body: {
        type: 'object',
        properties: {
            pageSize: { type: 'number' },
            pageNumber: { type: 'number' },
            keyword: { type: 'string' },
            status: { type: 'string' },
        }
    },
    response: {
        200: {
            description: 'Successful',
            type: 'object',
            properties: {
                success: { type: 'string' },
                message: { type: 'string' },
                result: {
                    type: 'array',
                    properties: {
                        id: { type: 'number' },
                        orderNo: { type: 'string' },
                        status: { type: 'string' },
                        orderDetails: {
                            type: 'array',
                            properties: {
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'number' },
                                        productId: { type: 'number' },
                                        category: { type: 'string' },
                                        price: { type: 'number' },
                                        quantity: { type: 'number' },
                                        totalPrice: { type: 'number' },
                                    }
                                }
                            }
                        }
                    }
                },
                totalData: { type: 'string' },
            }
        },
        400: {
            description: 'error response',
            type: 'object',
            properties: {
                success: { type: 'string' },
                message: { type: 'string' },
                error: { type: 'string' },
            }
        }
    }
};
exports.DeleteOrder = {
    description: 'OrderList',
    tags: ['Order'],
    summary: 'Order',
    body: {
        type: 'object',
        properties: {
            ordeNumber: { type: 'string' },
        }
    },
    response: {
        200: {
            description: 'Successful',
            type: 'object',
            properties: {
                success: { type: 'string' },
                message: { type: 'string' },
                result: { type: 'string' },
            }
        }
    }
};
//# sourceMappingURL=schema.js.map