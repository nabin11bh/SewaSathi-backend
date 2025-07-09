import { Dialect } from "sequelize";

export const envConfig = {
  database: process.env.DB_NAME || "",
  username: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  host: process.env.DB_HOST || "localhost",
  dialect: process.env.DB_DIALECT as Dialect || "mysql",
  port: parseInt(process.env.DB_PORT || "3306", 10)
};
