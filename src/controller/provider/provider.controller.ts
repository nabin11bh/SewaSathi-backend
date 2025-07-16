import { Request, Response } from "express";
import { Service } from "../../database/models/service.model";
import { IUser } from "../../types/user.type";
import { ServiceCreationAttrs } from "../../types/service.type";

export const createService = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser | undefined;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    if (user.role !== "provider") {
      return res.status(403).json({ message: "Forbidden: Only providers can create services" });
    }

    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const serviceData: ServiceCreationAttrs = {
      providerId: user.id,
      name,
      description,
      price,
      category,
    };

    const newService = await Service.create(serviceData); 

    return res.status(201).json({ message: "Service created", service: newService });

  } catch (error) {
    console.error("Create Service Error:", error);
    return res.status(500).json({ message: "Server error while creating service" });
  }
};
