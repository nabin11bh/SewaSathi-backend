// src/controller/globals/auth/auth.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../../database/models/user.model";
import { envConfig } from "../../../config/config";
import { IUser } from "../../../types/user.type";

const JWT_SECRET = envConfig.secret || "defaultsecret";

// POST /api/auth/register
export const register = async (req: Request<{}, {}, IUser>, res: Response) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Only "customer" or "provider" can self-register. "admin" accounts are
    // created only by an existing admin (see the admin user-management routes),
    // never through this public endpoint.
    const safeRole = role === "provider" ? "provider" : "customer";

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
      address: address || null,
      role: safeRole,
    } as any);

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};