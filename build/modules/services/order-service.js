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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const models_1 = require("../../plugins/db/models");
const sequelize_1 = __importStar(require("sequelize"));
const query_options_1 = require("../../utils/query-options");
class OrderService {
    constructor(db) {
        this.insertOrderDetail = (param) => new Promise((resolve, reject) => {
            const { orderId, productId, category, price, quantity } = param;
            const totalPrice = quantity * price;
            this.orderDetailsModel.create({ orderId, productId, category, price, quantity, totalPrice, createdBy: 'test', createdDate: Date.now() })
                .then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
        this.getUniqueId = () => new Promise((resolve, reject) => {
            let target = "";
            this.db.query("SELECT NEXT VALUE FOR SEQ_ORDER_NUMBER AS SEQ_ORDER_NUM", {
                type: sequelize_1.default.QueryTypes.SELECT
            }).then((data) => {
                data.map(row => target = row.SEQ_ORDER_NUM);
                resolve(target);
            }).catch(err => {
                reject(err);
            });
        });
        this.inputOrder = (parameter) => new Promise((resolve, reject) => {
            let inputOrderNo = "", insertId;
            try {
                this.getUniqueId().then((data) => {
                    inputOrderNo = data.toString().padStart(8, 'OR000000');
                    insertId = data;
                    this.insertOrder({ parameter, inputOrderNo, insertId }).then(data => {
                        resolve(data);
                    });
                });
            }
            catch (error) {
                reject(error);
            }
        });
        this.insertOrder = (param) => new Promise((resolve, reject) => {
            const { parameter, inputOrderNo, insertId } = param;
            const { request } = parameter;
            const { paymentType, status, orderDetail } = request;
            let resultOrderDetail = [];
            let productId = 0, category = "", price = 0, quantity = 0;
            this.ordersModel.create({ orderNo: inputOrderNo, status: status, paymentType: paymentType, createdDate: Date.now(), createdBy: 'test' })
                .then(data => {
                for (let i = 0; i < orderDetail.length; i++) {
                    productId = orderDetail[i].productId;
                    category = orderDetail[i].category;
                    price = orderDetail[i].price;
                    quantity = orderDetail[i].quantity;
                    const orderDetails = this.insertOrderDetail({ orderId: data.id, productId, category, price, quantity });
                    resultOrderDetail.push(orderDetails);
                }
                const validateResult = {
                    orderNo: inputOrderNo,
                    status: data.status,
                    orderDetail: resultOrderDetail
                };
                resolve(validateResult);
            }).catch(err => {
                reject(err);
            });
        });
        this.updateOrderStatus = (param) => new Promise((resolve, reject) => {
            const { orderNo, status } = param;
            const transactionStatusUpper = status.toUpperCase();
            switch (transactionStatusUpper) {
                case "COMPLETED":
                case "CANCELLED":
                    this.ordersModel.update({ status: transactionStatusUpper, lastUpdatedDate: Date.now(), lastUpdatedBy: 'test1' }, {
                        where: {
                            orderNo: orderNo
                        }
                    }).catch(err => console.log(err));
                    break;
                default:
                    reject('Wrong status');
            }
        });
        this.updateOrderDetail = (param) => new Promise((resolve, reject) => {
            const { request } = param;
            const { orderNo, status } = request;
            // console.log(request)
            if (orderNo != "") {
                try {
                    this.updateOrderStatus({ orderNo, status })
                        .catch(err => {
                        reject(err);
                    });
                    this.responseUpdateUpdateDetail(param).then(data => {
                        resolve(data);
                    }).catch(err => {
                        reject(err);
                    });
                }
                catch (error) {
                    reject(error);
                }
            }
            else {
                reject("Transaction Code null.");
            }
        });
        this.responseUpdateUpdateDetail = (param) => new Promise((resolve, reject) => {
            const { request } = param;
            const { orderNo, status } = request;
            let resultProductDetail = [];
            this.ordersModel.hasMany(this.orderDetailsModel, { foreignKey: 'orderId' });
            this.orderDetailsModel.belongsTo(this.ordersModel, { foreignKey: 'orderId' });
            this.orderDetailsModel.findAll({
                include: [{ model: this.ordersModel, where: { orderNo: orderNo } }],
            })
                .then(data => {
                for (let i = 0; i < data.length; i++) {
                    const prodDetail = {
                        id: data[i].id,
                        productId: data[i].productId,
                        price: data[i].price,
                        quantity: data[i].quantity,
                        category: data[i].category,
                        totalPrice: data[i].totalPrice,
                    };
                    resultProductDetail.push(prodDetail);
                }
                const validateResult = {
                    id: data[0].order.id,
                    orderNo: data[0].order.orderNo,
                    status: data[0].order.status,
                    orderDetail: resultProductDetail
                };
                console.log(orderNo);
                resolve(validateResult);
            }).catch(err => {
                reject(err);
            });
        });
        this.getOrderList = (param) => new Promise((resolve, reject) => {
            const { request } = param;
            const { keyword, status } = request;
            const options = query_options_1.buildQueryOption(request);
            this.ordersModel.hasMany(this.orderDetailsModel, { foreignKey: 'orderId' });
            this.orderDetailsModel.belongsTo(this.ordersModel, { foreignKey: 'orderId' });
            options["include"] = [{ model: this.orderDetailsModel }];
            if (keyword) {
                options["where"] = {
                    orderNo: { [sequelize_1.Op.like]: `%${keyword}%` }
                };
            }
            if (status) {
                options["where"] = Object.assign(Object.assign({}, options["where"]), { status: { [sequelize_1.Op.like]: `%${status}%` } });
            }
            this.ordersModel.findAndCountAll(options).then((data) => {
                resolve({
                    totalData: data.rows.length, data: data.rows
                });
            }).catch((err) => {
                reject(err);
            });
        }).catch(err => {
            console.log(err);
        });
        this.deleteOrder = (param) => new Promise((resolve, reject) => {
            const { request } = param;
            const { ordeNumber } = request;
            console.log(request);
            this.ordersModel.findOne({
                where: {
                    orderNo: ordeNumber
                }
            }).then((order) => {
                console.log(order);
                if (order) {
                    this.orderDetailsModel.destroy({
                        where: {
                            orderId: order.id
                        }
                    }).then(() => {
                        this.ordersModel.destroy({
                            where: {
                                orderNo: ordeNumber
                            }
                        }).then(() => {
                            resolve('success deleted');
                        });
                    }).catch((err) => {
                        reject(err);
                    });
                }
                else {
                    reject('order number not found');
                }
            });
        }).catch(err => {
            console.log(err);
        });
        this.db = db;
        this.orderDetailsModel = models_1.OrderDetailsFactory(this.db);
        this.ordersModel = models_1.OrdersFactory(this.db);
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=order-service.js.map