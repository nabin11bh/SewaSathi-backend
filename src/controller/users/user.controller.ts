// src/controller/users/user.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../../database/models/user.model";

// GET /api/users/profile
export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.user?.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/users/profile
export const updateMyProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, phone, address, bio, skills, experienceYears } = req.body;

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.phone = phone ?? user.phone;
    user.address = address ?? user.address;
    user.bio = bio ?? user.bio;
    user.skills = skills ?? user.skills;
    if (experienceYears !== undefined) {
      user.experienceYears = experienceYears === "" ? null : Number(experienceYears);
    }

    await user.save();

    const { password, ...userData } = user.toJSON();
    res.json({ message: "Profile updated successfully", user: userData });
  } catch (error: any) {
    if (error?.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "That email or phone is already in use" });
    }
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/users (admin only)
// Returns a bare array — matches the convention already used by the
// bookings endpoints, and what the frontend's admin hooks expect.
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });
    res.json(users);
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/users/:id (admin only)
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/users/:id (admin only)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    if (req.params.id === req.user?.id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/users (admin only)
// This is the ONLY way an admin or provider account gets created —
// never exposed on the public /auth/register endpoint. See auth.controller.ts,
// which hard-codes new self-registrations to "customer" or "provider" only.
export const createUserByAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "name, email, password, and role are required" });
    }
    if (!["admin", "provider"].includes(role)) {
      return res.status(400).json({ message: 'role must be "admin" or "provider"' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    } as any);

    const { password: _, ...userData } = user.toJSON();
    res.status(201).json({ message: "Account created", user: userData });
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};