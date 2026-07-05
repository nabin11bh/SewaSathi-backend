// src/controller/globals/contact.controller.ts
import { Request, Response } from "express";
import { ContactMessage } from "../../database/models/contact.model";

// POST /api/contact — public, no auth required
export const submitContactMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ message: "name, email, subject, and message are all required" });
    }

    await ContactMessage.create({ name, email, subject, message } as any);

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ message: "Server error" });
  }
};