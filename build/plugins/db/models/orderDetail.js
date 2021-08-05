"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDetailsFactory = exports.OrderDetails = void 0;
const sequelize_1 = require("sequelize");
class OrderDetails extends sequelize_1.Model {
}
exports.OrderDetails = OrderDetails;
const orderDetails = {
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    orderId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    productId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    category: { type: sequelize_1.DataTypes.STRING(100) },
    price: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    totalPrice: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
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
function OrderDetailsFactory(sequelize) {
    const attributes = orderDetails;
    return sequelize.define("orderDetails", attributes, $OPTIONS);
}
exports.OrderDetailsFactory = OrderDetailsFactory;
//# sourceMappingURL=orderDetail.js.map