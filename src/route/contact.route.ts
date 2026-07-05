// src/route/contact.route.ts
import { Router } from "express";
import { submitContactMessage } from "../controller/globals/contact.controller";

const router = Router();

router.post("/", submitContactMessage);

export default router;