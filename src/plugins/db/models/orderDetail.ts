import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface OrderDetailsAttributes {
    id: number;
    orderId: number;
    productId: number;
    productName: string,
    category: string,
    price: number;
    quantity: number;
    createdBy?: string;
    createdDate?: Date;
    lastUpdatedDate?: Date;
    lastUpdatedBy?: string;
}
export interface OrderDetailsModel extends Model<OrderDetailsAttributes>, OrderDetailsAttributes { }
export class OrderDetails extends Model<OrderDetailsModel, OrderDetailsAttributes> { }

export type OrderDetailsStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): OrderDetailsModel;
};

const orderDetails = {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    category: { type: DataTypes.STRING(100) },
    price: { type: DataTypes.INTEGER, allowNull: false },
    totalPrice: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
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

export function OrderDetailsFactory(sequelize: Sequelize): OrderDetailsStatic {
    const attributes = orderDetails;
    return <OrderDetailsStatic>sequelize.define("orderDetails", attributes, $OPTIONS);
}
