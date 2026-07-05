// src/database/models/booking.model.ts
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
  customerId: string;
  serviceId: number;
  date: string;
  time: string;
  address: string;
  notes?: string | null;
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
  @Column(DataType.UUID)
  customerId!: string;

  @ForeignKey(() => Service)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  serviceId!: number;

  // Replaced the single `scheduledDate` with separate date/time strings —
  // matches the frontend's BookingModal fields exactly, no parsing needed.
  @AllowNull(false)
  @Column(DataType.STRING)
  date!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  time!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  address!: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  notes!: string | null;

  @Default("pending")
  @Column(DataType.STRING)
  status!: string;

  @BelongsTo(() => User)
  customer!: User;

  @BelongsTo(() => Service)
  service!: Service;
}