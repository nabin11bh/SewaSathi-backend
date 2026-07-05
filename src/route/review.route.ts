// src/route/review.route.ts
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import {
  createReview,
  getReviewsForService,
  deleteReview,
} from "../controller/customer/review.controller";

const router = Router();

router.post("/", authenticate, authorize("customer"), createReview);
router.get("/service/:serviceId", getReviewsForService); // public — anyone can read reviews
router.delete("/:id", authenticate, deleteReview);

export default router;