import { OrdersFactory, OrderDetailsFactory } from '../../plugins/db/models';
import Sequelize, { Op } from 'sequelize';
import { buildQueryOption } from '../../utils/query-options';
import { OrderDetailsInputAttributes } from '../../interface/order';

export class OrderService {

    db: any;
    orderDetailsModel;
    ordersModel;

    constructor(db) {
        this.db = db;
        this.orderDetailsModel = OrderDetailsFactory(this.db);
        this.ordersModel = OrdersFactory(this.db);

    }

    insertOrderDetail = (param: OrderDetailsInputAttributes) => new Promise((resolve, reject) => {
        const { orderId, productId, category, price, quantity } = param;
        const totalPrice = quantity * price;

        this.orderDetailsModel.create({ orderId, productId, category, price, quantity, totalPrice, createdBy: 'test', createdDate: Date.now() })
            .then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
    });

    getUniqueId = () => new Promise((resolve, reject) => {
        let target = "";
        this.db.query("SELECT NEXT VALUE FOR SEQ_ORDER_NUMBER AS SEQ_ORDER_NUM", {
            type: Sequelize.QueryTypes.SELECT
        }).then((data) => {
            data.map(row => target = row.SEQ_ORDER_NUM);
            resolve(target);
        }).catch(err => {
            reject(err);
        });
    });

    inputOrder = (parameter: Object) => new Promise((resolve, reject) => {
        let inputOrderNo = "", insertId;

        try {
            this.getUniqueId().then((data: number) => {
                inputOrderNo = data.toString().padStart(8, 'OR000000')
                insertId = data;
                this.insertOrder({ parameter, inputOrderNo, insertId }).then(data => {
                    resolve(data);
                });
            });

        } catch (error) {
            reject(error);
        }
    });

    insertOrder = (param: any) => new Promise((resolve, reject) => {
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

    updateOrderStatus = (param) => new Promise((resolve, reject) => {
        const { orderNo, status } = param;
        const transactionStatusUpper = status.toUpperCase();

        switch (transactionStatusUpper) {
            case "COMPLETED":
            case "CANCELLED":
                this.ordersModel.update({ status: transactionStatusUpper, lastUpdatedDate: Date.now(), lastUpdatedBy: 'test1' }, {
                    where: {
                        orderNo: orderNo
                    }
                }).catch(err => console.log(err))
                break;
            default:
                reject('Wrong status');
        }
    });

    updateOrderDetail = (param) => new Promise((resolve, reject) => {
        const { request } = param;
        const { orderNo, status } = request;
        // console.log(request)
        if (orderNo != "") {
            try {
                this.updateOrderStatus({ orderNo, status })
                    .catch(err => {
                        reject(err);
                    })
                this.responseUpdateUpdateDetail(param).then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                })
            } catch (error) {
                reject(error);
            }
        } else {
            reject("Transaction Code null.")
        }
    });

    responseUpdateUpdateDetail = (param) => new Promise((resolve, reject) => {
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

                console.log(orderNo)

                resolve(validateResult);
            }).catch(err => {
                reject(err);
            });
    });


    getOrderList = (param) => new Promise((resolve, reject) => {
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

    deleteOrder = (param) => new Promise((resolve, reject) => {
        const { request } = param;
        const { ordeNumber } = request;

        console.log(request)
        this.ordersModel.findOne({
            where: {
                orderNo: ordeNumber
            }
        }).then((order: any) => {
            console.log(order)
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
                    })

                }).catch((err) => {
                    reject(err);
                });
            } else {
                reject('order number not found');
            }
        })




    }).catch(err => {
        console.log(err);
    });

}

