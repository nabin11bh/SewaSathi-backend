import { Dialect } from "sequelize";

export const envConfig = {
  appPort: parseInt(process.env.PORT || "4000", 10),

  database: process.env.DB_NAME || "",
  username: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  host: process.env.DB_HOST || "localhost",
  dialect: (process.env.DB_DIALECT || "mysql") as Dialect,
  dbport: parseInt(process.env.DB_PORT || "3306", 10),
  secret: process.env.JWT_SECRET || ""
};
