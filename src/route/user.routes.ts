// src/routes/user.route.ts

import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  getUserById,
  deleteUser,
} from "../controller/users/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware"; // Add this if using role-based access

const router = Router();

// Customer or Provider
router.get("/profile", authenticate, getMyProfile);
router.put("/profile", authenticate, updateMyProfile);

//  Admin only
router.get("/", authenticate, authorize("admin"), getAllUsers);
router.get("/:id", authenticate, authorize("admin"), getUserById);
router.delete("/:id", authenticate, authorize("admin"), deleteUser);

export default router;
