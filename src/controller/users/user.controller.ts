

      import { Request, Response } from "express";
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

          const { name, phone, address } = req.body;

          user.name = name || user.name;
          user.phone = phone || user.phone;
          user.address = address || user.address;

          await user.save();

          const { password, ...userData } = user.toJSON();
          res.json({ message: "Profile updated successfully", user: userData });
        } catch (error) {
          console.error("Update Profile Error:", error);
          res.status(500).json({ message: "Server error" });
        }
      };

      // GET /api/users (admin only)
      export const getAllUsers = async (_req: Request, res: Response) => {
        try {
          const users = await User.findAll({
            attributes: { exclude: ["password"] },
          });
          res.json({ users });
        } catch (error) {
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
          const user = await User.findByPk(req.params.id);
          if (!user) return res.status(404).json({ message: "User not found" });

          await user.destroy();
          res.json({ message: "User deleted successfully" });
        } catch (error) {
          res.status(500).json({ message: "Server error" });
        }
      };
