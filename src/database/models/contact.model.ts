// src/database/models/contact.model.ts
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  AllowNull,
} from "sequelize-typescript";

export interface ContactMessageCreationAttrs {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Table({
  tableName: "contact_messages",
  timestamps: true,
})
export class ContactMessage extends Model<ContactMessage, ContactMessageCreationAttrs> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  subject!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  message!: string;
}