// src/route/auth.route.ts
import { Router } from "express";
import { register, login } from "../controller/globals/auth/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;