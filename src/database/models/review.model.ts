import { Model, DataTypes } from "sequelize";
import sequelize from "../../database/connection";
import { User } from "./user.model";
import { Service } from "./service.model";

export class Review extends Model {}

Review.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    customerId: { type: DataTypes.INTEGER, allowNull: false },
    serviceId: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false }, // 1 to 5
    comment: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, modelName: "review" }
);

Review.belongsTo(User, { foreignKey: "customerId" });
Review.belongsTo(Service, { foreignKey: "serviceId" });
