import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { createBooking } from "../controller/customer/booking.controller";

const router = Router();

router.post("/book", authenticate, authorize("customer"), createBooking);

export default router;
