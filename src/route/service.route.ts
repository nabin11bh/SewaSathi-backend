import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { createService } from "../controller/provider/provider.controller";

const router = Router();

router.post(
  "/add",
  authenticate,
  authorize("provider"),
  createService
);



export default router;
