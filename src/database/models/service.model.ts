// src/database/models/service.model.ts
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
  Default,
} from "sequelize-typescript";
import { User } from "./user.model";

export interface ServiceCreationAttrs {
  providerId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  image?: string | null;
}

@Table({
  tableName: "services",
  timestamps: true,
})
export class Service extends Model<Service, ServiceCreationAttrs> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  providerId!: string;

  @BelongsTo(() => User)
  provider!: User;

  // Renamed from "name" to "title" to match the frontend's ServiceFormModal.
  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description!: string;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  price!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  category!: string;

  // New — the frontend's service form and ServiceCard both need this.
  @AllowNull(true)
  @Column(DataType.STRING)
  location!: string | null;

  // New — optional cover image URL.
  @AllowNull(true)
  @Column(DataType.STRING)
  image!: string | null;

  @Default(true)
  @Column(DataType.BOOLEAN)
  isAvailable!: boolean;
}