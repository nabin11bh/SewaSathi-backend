import { Request, Response } from "express";
import { Service } from "../../database/models/service.model";

export const createService = async (req: Request, res: Response) => {
  try {
    const providerIdStr = req.user?.id;

    if (!providerIdStr) {
      return res.status(401).json({ message: "Unauthorized: Provider ID missing" });
    }

    const providerId = parseInt(providerIdStr, 10);
    if (isNaN(providerId)) {
      return res.status(400).json({ message: "Invalid provider ID" });
    }

    const { name, description, price, category } = req.body;
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newService = await Service.create({
      providerId,  // correctly using converted providerId
      name,
      description,
      price,
      category,
    });

    return res.status(201).json({ message: "Service created", service: newService });
  } catch (error) {
    console.error("Error creating service:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
