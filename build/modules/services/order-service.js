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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const models_1 = require("../../plugins/db/models");
const sequelize_1 = __importStar(require("sequelize"));
// import { buildQueryOption } from 'utils/query-options';
const query_options_1 = require("../../utils/query-options");
class OrderService {
    constructor(db) {
        this.insertOrderDetail = (param) => __awaiter(this, void 0, void 0, function* () {
            const { orderId, productId, category, price, quantity } = param;
            const totalPrice = quantity * price;
            yield this.orderDetailsModel.create({ orderId, productId, category, price, quantity, totalPrice, createdBy: 'test', createdDate: Date.now() })
                .then(data => {
                return (data);
            }).catch(err => {
                throw err;
            });
        });
        this.getUniqueId = (param) => __awaiter(this, void 0, void 0, function* () {
            let target = "";
            yield this.db.query("SELECT NEXT VALUE FOR SEQ_ORDER_NUMBER AS SEQ_ORDER_NUM", {
                type: sequelize_1.default.QueryTypes.SELECT
            }).then((data) => {
                data.map(row => target = row.SEQ_ORDER_NUM);
                return target;
            }).catch(err => {
                throw err;
            });
        });
        this.inputOrder = (parameter) => __awaiter(this, void 0, void 0, function* () {
            let inputOrderNo = "", insertId;
            try {
                yield this.getUniqueId({}).then((data) => {
                    inputOrderNo = data.toString().padStart(8, 'OR000000');
                    insertId = data;
                    this.insertOrder({ parameter, inputOrderNo, insertId }).then(data => {
                        return data;
                    });
                });
            }
            catch (error) {
                throw error;
            }
        });
        this.insertOrder = (param) => __awaiter(this, void 0, void 0, function* () {
            const { parameter, inputOrderNo, insertId } = param;
            const { request } = parameter;
            const { paymentType, status, orderDetail } = request;
            let resultOrderDetail = [];
            let productId = 0, category = "", price = 0, quantity = 0;
            yield this.ordersModel.create({ orderNo: inputOrderNo, status: status, paymentType: paymentType, createdDate: Date.now(), createdBy: 'test' })
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
                return validateResult;
            }).catch(err => {
                throw err;
            });
        });
        this.updateOrderStatus = (param) => __awaiter(this, void 0, void 0, function* () {
            const { orderNo, status } = param;
            const transactionStatusUpper = status.toUpperCase();
            switch (transactionStatusUpper) {
                case "COMPLETED":
                case "CANCELLED":
                    yield this.ordersModel.update({ status: transactionStatusUpper, lastUpdatedDate: Date.now(), lastUpdatedBy: 'test1' }, {
                        where: {
                            orderNo: orderNo
                        }
                    }).catch(err => console.log(err));
                    break;
                default:
                    throw 'Wrong status';
            }
        });
        this.updateOrderDetail = (param) => __awaiter(this, void 0, void 0, function* () {
            const { request } = param;
            const { orderNo, status } = request;
            // console.log(request)
            if (orderNo != "") {
                try {
                    yield this.updateOrderStatus({ orderNo, status })
                        .catch(err => {
                        throw err;
                    });
                    yield this.responseUpdateUpdateDetail(param).then(data => {
                        return data;
                    }).catch(err => {
                        throw err;
                    });
                }
                catch (error) {
                    throw error;
                }
            }
            else {
                throw "Transaction Code null.";
            }
        });
        this.responseUpdateUpdateDetail = (param) => __awaiter(this, void 0, void 0, function* () {
            const { request } = param;
            const { orderNo, status } = request;
            let resultProductDetail = [];
            this.ordersModel.hasMany(this.orderDetailsModel, { foreignKey: 'orderId' });
            this.orderDetailsModel.belongsTo(this.ordersModel, { foreignKey: 'orderId' });
            yield this.orderDetailsModel.findAll({
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
                return validateResult;
            }).catch(err => {
                throw err;
            });
        });
        this.getOrderList = (param) => __awaiter(this, void 0, void 0, function* () {
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
            yield this.ordersModel.findAndCountAll(options).then((data) => {
                return ({
                    totalData: data.rows.length, data: data.rows
                });
            }).catch((err) => {
                throw err;
            });
        });
        this.deleteOrder = (param) => __awaiter(this, void 0, void 0, function* () {
            const { request } = param;
            const { ordeNumber } = request;
            yield this.ordersModel.findOne({
                where: {
                    orderNo: ordeNumber
                }
            }).then((order) => __awaiter(this, void 0, void 0, function* () {
                if (order) {
                    yield this.orderDetailsModel.destroy({
                        where: {
                            orderId: order.id
                        }
                    }).then(() => __awaiter(this, void 0, void 0, function* () {
                        yield this.ordersModel.destroy({
                            where: {
                                orderNo: ordeNumber
                            }
                        }).then(() => {
                            return 'success deleted';
                        });
                    })).catch((err) => {
                        throw err;
                    });
                }
                else {
                    throw 'order number not found';
                }
            }));
        });
        this.db = db;
        this.orderDetailsModel = models_1.OrderDetailsFactory(this.db);
        this.ordersModel = models_1.OrdersFactory(this.db);
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=order-service.js.map