import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { getDashboardStats, getAllBookings } from "../controller/admin/admin.controller";

const router = Router();

// Stats
router.get("/stats", authenticate, authorize("admin"), getDashboardStats);

// Bookings
router.get("/bookings", authenticate, authorize("admin"), getAllBookings);

export default router;
