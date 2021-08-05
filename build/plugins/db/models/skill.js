"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsFactory = exports.Skills = void 0;
const sequelize_1 = require("sequelize");
class Skills extends sequelize_1.Model {
}
exports.Skills = Skills;
const skills = {
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    skill: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
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
function SkillsFactory(sequelize) {
    const attributes = skills;
    return sequelize.define("skills", attributes, $OPTIONS);
}
exports.SkillsFactory = SkillsFactory;
//# sourceMappingURL=skill.js.map