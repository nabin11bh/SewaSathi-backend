// src/config/config.ts
import { Dialect } from "sequelize";

export const envConfig = {
  appPort: parseInt(process.env.PORT || "4000", 10),

  database: process.env.DB_NAME || "",
  username: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  host: process.env.DB_HOST || "localhost",
  dialect: (process.env.DB_DIALECT || "mysql") as Dialect,
  dbport: parseInt(process.env.DB_PORT || "3306", 10),
  secret: process.env.JWT_SECRET || "",

  // Cloudinary — used by upload.middleware.ts for real image uploads
  cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
};