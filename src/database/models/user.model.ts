import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  Unique,
  AllowNull,
  Default,
} from "sequelize-typescript";
import { UUIDV4 } from "sequelize";
import { IUser } from "../../types"; 


export type IUserCreationAttributes = Omit<IUser, "createdAt" | "updatedAt">;

@Table({
  tableName: "users",
  modelName: "User",
  timestamps: true,
})
export class User extends Model<IUser, IUserCreationAttributes> {
  @PrimaryKey
  @Default(UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  phone!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  address!: string;

  @AllowNull(false)
  @Default("customer")
  @Column(DataType.ENUM("customer", "provider", "admin"))
  role!: "customer" | "provider" | "admin";

  @CreatedAt
  @Column({ field: "created_at" })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  updatedAt!: Date;
}
