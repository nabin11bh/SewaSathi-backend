// src/config/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
import { envConfig } from "./config";

cloudinary.config({
  cloud_name: envConfig.cloudinaryName,
  api_key: envConfig.cloudinaryApiKey,
  api_secret: envConfig.cloudinaryApiSecret,
});

export default cloudinary;