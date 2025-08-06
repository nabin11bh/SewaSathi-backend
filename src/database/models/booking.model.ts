import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
  AllowNull,
} from "sequelize-typescript";
import { User } from "./user.model";
import { Service } from "./service.model";

export interface BookingCreationAttrs {
  customerId: string;  // UUID matching User.id
  serviceId: number;   // INTEGER matching Service.id
  scheduledDate: Date;
  status?: string;
}

@Table({
  tableName: "bookings",
  timestamps: true,
})
export class Booking extends Model<Booking, BookingCreationAttrs> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)  // UUID matching User.id
  customerId!: string;

  @ForeignKey(() => Service)
  @AllowNull(false)
  @Column(DataType.INTEGER)  // INTEGER matching Service.id
  serviceId!: number;

  @AllowNull(false)
  @Column(DataType.DATE)
  scheduledDate!: Date;

  @Default("pending")
  @Column(DataType.STRING)
  status!: string;

  @BelongsTo(() => User)
  customer!: User;

  @BelongsTo(() => Service)
  service!: Service;
}
