import { Request, Response } from "express";
import { Service } from "../../database/models/service.model";


//create services

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
      providerId,  
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

// get all services
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.findAll();
    return res.status(200).json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//get single services by id

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json({ service });
  } catch (error) {
    console.error("Error fetching service:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//update services

export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;

    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // @ts-ignore
    if (service.providerId !== req.user?.id) {
      return res.status(403).json({ message: "Not authorized to update this service" });
    }

    await service.update({ name, description, price, category });

    return res.status(200).json({ message: "Service updated", service });
  } catch (error) {
    console.error("Error updating service:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//delete services

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const isAdmin = req.user?.role === "admin";
    const isOwner = service.providerId === Number(req.user?.id);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Not authorized to delete this service" });
    }

    await service.destroy();
    return res.status(200).json({ message: "Service deleted" });
  } catch (error) {
    console.error("Error deleting service:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
