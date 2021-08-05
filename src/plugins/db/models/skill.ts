import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface SkillsAttributes {
    id: number;
    skill: string;
    createdBy?: string;
    createdDate?: Date;
    lastUpdatedDate?: Date;
    lastUpdatedBy?: string;
}
export interface SkillsModel extends Model<SkillsAttributes>, SkillsAttributes { }
export class Skills extends Model<SkillsModel, SkillsAttributes> { }

export type SkillsStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): SkillsModel;
};

const skills = {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    skill: { type: DataTypes.STRING, allowNull: false, unique: true },
    createdDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdBy: { type: DataTypes.STRING, allowNull: false },
    lastUpdatedDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: true },
    lastUpdatedBy: { type: DataTypes.STRING, allowNull: true },
}

const $OPTIONS = {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,
    // If don't want createdAt
    createdAt: false,
    // If don't want updatedAt
    updatedAt: false,
}

export function SkillsFactory(sequelize: Sequelize): SkillsStatic {
    const attributes = skills;
    return <SkillsStatic>sequelize.define("skills", attributes, $OPTIONS);
}
