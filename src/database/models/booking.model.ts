import { DataTypes } from "sequelize";
import sequelize from "../connection"
import { User } from "./user.model";
import { Service } from "./service.model";

export const Booking = sequelize.define("Booking", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  scheduledDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending", // pending | confirmed | completed | cancelled
  },
});

// Associations
Booking.belongsTo(User, { foreignKey: "customerId" });
Booking.belongsTo(Service, { foreignKey: "serviceId" });
