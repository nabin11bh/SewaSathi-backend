// src/middleware/upload.middleware.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "sewasathi/services",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    transformation: [{ width: 1200, height: 800, crop: "limit" }],
  }),
});

export const uploadServiceImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});