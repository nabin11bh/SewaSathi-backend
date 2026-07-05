// src/database/models/review.model.ts
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  ForeignKey,
  BelongsTo,
  AllowNull,
} from "sequelize-typescript";
import { User } from "./user.model";
import { Service } from "./service.model";

export interface ReviewCreationAttrs {
  customerId: string;
  serviceId: number;
  rating: number;
  comment?: string | null;
}

@Table({
  tableName: "reviews",
  timestamps: true,
})
export class Review extends Model<Review, ReviewCreationAttrs> {
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

  @AllowNull(false)
  @Column(DataType.INTEGER)
  rating!: number;

  @AllowNull(true)
  @Column(DataType.TEXT)
  comment!: string | null;

  @BelongsTo(() => User)
  customer!: User;

  @BelongsTo(() => Service)
  service!: Service;
}