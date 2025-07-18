import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { createBooking, getCustomerBookings, getProviderBookings } from "../controller/customer/booking.controller";

const router = Router();

router.post("/book", authenticate, authorize("customer"), createBooking);

router.get("/", authenticate, authorize("customer"), getCustomerBookings);

router.get("/provider", authenticate, authorize("provider"), getProviderBookings);



export default router;


