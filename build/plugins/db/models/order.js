"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersFactory = exports.Orders = void 0;
const sequelize_1 = require("sequelize");
class Orders extends sequelize_1.Model {
}
exports.Orders = Orders;
const orders = {
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    orderNo: { type: sequelize_1.DataTypes.STRING(10), allowNull: false, unique: true },
    status: { type: sequelize_1.DataTypes.STRING(20), allowNull: false, },
    paymentType: { type: sequelize_1.DataTypes.STRING(20), allowNull: false, },
    createdDate: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW, allowNull: false },
    createdBy: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    lastUpdatedDate: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW, allowNull: true },
    lastUpdatedBy: { type: sequelize_1.DataTypes.STRING, allowNull: true },
};
const $OPTIONS = {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,
    // If don't want createdAt
    createdAt: false,
    // If don't want updatedAt
    updatedAt: false,
};
function OrdersFactory(sequelize) {
    const attributes = orders;
    return sequelize.define("orders", attributes, $OPTIONS);
}
exports.OrdersFactory = OrdersFactory;
//# sourceMappingURL=order.js.map