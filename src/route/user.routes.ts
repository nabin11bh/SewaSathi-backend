import { authenticate } from "../middleware/auth.middleware";
import router from "./auth.route";

router.get("/profile", authenticate, (req,res) => {
  res.json({ userId: req.user?.id, role: req.user?.role });
});
export default router;