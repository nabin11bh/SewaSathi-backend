// src/route/booking.route.ts
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import {
  createBooking,
  getCustomerBookings,
  getProviderBookings,
  updateBookingStatus,
} from "../controller/customer/booking.controller";

const router = Router();

// Fixed: this used to be POST "/bookings" while mounted at "/api/bookings",
// which produced the wrong URL "/api/bookings/bookings".
router.post("/", authenticate, authorize("customer"), createBooking);

// Fixed: was GET "/" — frontend expects "/customer" specifically.
router.get("/customer", authenticate, authorize("customer"), getCustomerBookings);

router.get("/provider", authenticate, authorize("provider"), getProviderBookings);

// New — powers the provider's Confirm / Start / Complete / Cancel actions.
router.patch(
  "/:id/status",
  authenticate,
  authorize("provider", "admin"),
  updateBookingStatus
);

export default router;