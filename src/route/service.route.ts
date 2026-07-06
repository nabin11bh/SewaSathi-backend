// src/route/service.route.ts
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { uploadServiceImage } from "../middleware/upload.middleware";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controller/provider/provider.controller";

const router = Router();

router.get("/", getAllServices);
router.get("/:id", getServiceById);

router.post(
  "/add",
  authenticate,
  authorize("provider"),
  uploadServiceImage.single("image"),
  createService
);

router.put(
  "/:id",
  authenticate,
  authorize("provider"),
  uploadServiceImage.single("image"),
  updateService
);

router.delete("/:id", authenticate, deleteService);

export default router;