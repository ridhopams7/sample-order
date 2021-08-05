import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface OrdersAttributes {
    id: number;
    orderNo: string;
    status: string;
    createdDate?: Date;
    lastUpdatedDate?: Date;
    lastUpdatedBy?: string;
}
export interface OrdersModel extends Model<OrdersAttributes>, OrdersAttributes { }
export class Orders extends Model<OrdersModel, OrdersAttributes> { }

export type OrdersStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): OrdersModel;
};

const orders = {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    orderNo: { type: DataTypes.STRING(10), allowNull: false, unique: true },
    status: { type: DataTypes.STRING(20), allowNull: false, },
    paymentType: { type: DataTypes.STRING(20), allowNull: false, },
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

export function OrdersFactory(sequelize: Sequelize): OrdersStatic {
    const attributes = orders;
    return <OrdersStatic>sequelize.define("orders", attributes, $OPTIONS);
}
