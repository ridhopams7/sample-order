"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFactory = exports.User = void 0;
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
}
exports.User = User;
const users = {
    userId: {
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    username: {
        primaryKey: true,
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    address: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    createdDate: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW, allowNull: false },
    createdBy: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    lastUpdatedDate: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW, allowNull: true },
    lastUpdatedBy: { type: sequelize_1.DataTypes.STRING, allowNull: true },
};
const UserFactory = (sequalize) => {
    const attributes = users;
    return sequalize.define("users", attributes, {
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: true,
        // If don't want createdAt
        createdAt: false,
        // If don't want updatedAt
        updatedAt: false,
    });
};
exports.UserFactory = UserFactory;
//# sourceMappingURL=users.js.map