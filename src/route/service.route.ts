import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { createService } from "../controller/provider/provider.controller";
import { getAllServices,getServiceById,updateService,deleteService } from "../controller/provider/provider.controller";

const router = Router();

router.post(
  "/add",
  authenticate,
  authorize("provider"),
  createService
);

router.get("/", getAllServices); 
router.get("/:id", getServiceById); 
router.put("/:id", authenticate, authorize("provider"), updateService); 
router.delete("/:id", authenticate, authorize("provider", "admin"), deleteService); 



export default router;
