import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./user.model";

export interface ServiceCreationAttrs {
  providerId: string; // UUID string to match User.id
  name: string;
  description: string;
  price: number;
  category: string;
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
  @Column(DataType.UUID)  // UUID type to match User.id
  providerId!: string;

  @BelongsTo(() => User)
  provider!: User;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column(DataType.FLOAT)
  price!: number;

  @Column(DataType.STRING)
  category!: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isAvailable!: boolean;
}
