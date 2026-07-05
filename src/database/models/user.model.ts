// src/database/models/user.model.ts
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

export interface IUserCreationAttributes {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role?: "customer" | "provider" | "admin";
}

@Table({
  tableName: "users",
  modelName: "User",
  timestamps: true,
})
export class User extends Model<User, IUserCreationAttributes> {
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

  // Made optional — the frontend's Register form doesn't collect these.
  // Customers/providers can fill them in later from Edit Profile.
  @AllowNull(true)
  @Unique
  @Column(DataType.STRING)
  phone!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  address!: string | null;

  @AllowNull(false)
  @Default("customer")
  @Column(DataType.ENUM("customer", "provider", "admin"))
  role!: "customer" | "provider" | "admin";

  // Used by the provider profile page and admin panel — optional extra fields.
  @AllowNull(true)
  @Column(DataType.TEXT)
  bio!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  skills!: string | null;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  experienceYears!: number | null;

  @CreatedAt
  @Column({ field: "created_at" })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  updatedAt!: Date;
}