import { Request, Response } from "express";
import { Booking } from "../../database/models/booking.model";
import { Service } from "../../database/models/service.model";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const customerId = req.user?.id;
    const { serviceId, scheduledDate } = req.body;

    if (!serviceId || !scheduledDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const service = await Service.findByPk(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const booking = await Booking.create({
      customerId,
      serviceId,
      scheduledDate,
    });

    return res.status(201).json({ message: "Booking successful", booking });
  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
