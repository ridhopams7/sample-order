import { OrdersFactory, OrderDetailsFactory } from '../../plugins/db/models';
import Sequelize, { Op } from 'sequelize';
// import { buildQueryOption } from 'utils/query-options';
import { buildQueryOption } from '../../utils/query-options';

export class OrderService {

    db: any;
    orderDetailsModel;
    ordersModel;

    constructor(db) {
        this.db = db;
        this.orderDetailsModel = OrderDetailsFactory(this.db);
        this.ordersModel = OrdersFactory(this.db);

    }

    insertOrderDetail = async (param) => {
        const { orderId, productId, category, price, quantity } = param;
        const totalPrice = quantity * price;

        await this.orderDetailsModel.create({ orderId, productId, category, price, quantity, totalPrice, createdBy: 'test', createdDate: Date.now() })
            .then(data => {
                return (data);
            }).catch(err => {
                throw err
            });
    };

    getUniqueId = async (param) => {
        let target = "";
        await this.db.query("SELECT NEXT VALUE FOR SEQ_ORDER_NUMBER AS SEQ_ORDER_NUM", {
            type: Sequelize.QueryTypes.SELECT
        }).then((data) => {
            data.map(row => target = row.SEQ_ORDER_NUM);
            return target;
        }).catch(err => {
            throw err;
        });
    };

    inputOrder = async (parameter) => {
        let inputOrderNo = "", insertId;

        try {
            await this.getUniqueId({}).then((data: any) => {
                inputOrderNo = data.toString().padStart(8, 'OR000000')
                insertId = data;
                this.insertOrder({ parameter, inputOrderNo, insertId }).then(data => {
                    return data;
                });
            });

        } catch (error) {
            throw error;
        }
    };

    insertOrder = async (param) => {
        const { parameter, inputOrderNo, insertId } = param;
        const { request } = parameter;
        const { paymentType, status, orderDetail } = request;
        let resultOrderDetail = [];
        let productId = 0, category = "", price = 0, quantity = 0;
        await this.ordersModel.create({ orderNo: inputOrderNo, status: status, paymentType: paymentType, createdDate: Date.now(), createdBy: 'test' })
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
    };

    updateOrderStatus = async (param) => {
        const { orderNo, status } = param;
        const transactionStatusUpper = status.toUpperCase();

        switch (transactionStatusUpper) {
            case "COMPLETED":
            case "CANCELLED":
                await this.ordersModel.update({ status: transactionStatusUpper, lastUpdatedDate: Date.now(), lastUpdatedBy: 'test1' }, {
                    where: {
                        orderNo: orderNo
                    }
                }).catch(err => console.log(err))
                break;
            default:
                throw 'Wrong status';
        }
    };

    updateOrderDetail = async (param) => {
        const { request } = param;
        const { orderNo, status } = request;
        // console.log(request)
        if (orderNo != "") {
            try {
                await this.updateOrderStatus({ orderNo, status })
                    .catch(err => {
                        throw err;
                    })
                await this.responseUpdateUpdateDetail(param).then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                })
            } catch (error) {
                throw error;
            }
        } else {
            throw "Transaction Code null."
        }
    };

    responseUpdateUpdateDetail = async (param) => {
        const { request } = param;
        const { orderNo, status } = request;
        let resultProductDetail = [];
        this.ordersModel.hasMany(this.orderDetailsModel, { foreignKey: 'orderId' });
        this.orderDetailsModel.belongsTo(this.ordersModel, { foreignKey: 'orderId' });
        await this.orderDetailsModel.findAll({
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
    };


    getOrderList = async (param) => {
        const { request } = param;
        const { keyword, status } = request
        const options = buildQueryOption(request)
        this.ordersModel.hasMany(this.orderDetailsModel, { foreignKey: 'orderId' });
        this.orderDetailsModel.belongsTo(this.ordersModel, { foreignKey: 'orderId' });

        options["include"] = [{ model: this.orderDetailsModel }]

        if (keyword) {
            options["where"] = {
                orderNo: { [Op.like]: `%${keyword}%` }
            }
        }
        if (status) {
            options["where"] = {
                ...options["where"],
                status: { [Op.like]: `%${status}%` }
            }
        }

        await this.ordersModel.findAndCountAll(options).then((data) => {
            return ({
                totalData: data.rows.length, data: data.rows
            });
        }).catch((err) => {
            throw err;
        });
    }


    deleteOrder = async (param) => {
        const { request } = param;
        const { ordeNumber } = request;

        await this.ordersModel.findOne({
            where: {
                orderNo: ordeNumber
            }
        }).then(async (order: any) => {
            if (order) {
                await this.orderDetailsModel.destroy({
                    where: {
                        orderId: order.id
                    }
                }).then(async () => {
                    await this.ordersModel.destroy({
                        where: {
                            orderNo: ordeNumber
                        }
                    }).then(() => {
                        return 'success deleted';
                    })

                }).catch((err) => {
                    throw err;
                });
            } else {
                throw 'order number not found';
            }
        })
    }

}

