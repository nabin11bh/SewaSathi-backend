import { Request, Response } from "express";
import { Booking } from "../../database/models/booking.model";
import { Service } from "../../database/models/service.model";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const customerId = req.user?.id;  // should be string (UUID)
    if (!customerId) {
      return res.status(401).json({ message: "Unauthorized: Customer ID missing" });
    }

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

// For customer to see their bookings
export const getCustomerBookings = async (req: Request, res: Response) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      return res.status(401).json({ message: "Unauthorized: Customer ID missing" });
    }
    const bookings = await Booking.findAll({ where: { customerId } });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching customer bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// For provider to see bookings on their services
export const getProviderBookings = async (req: Request, res: Response) => {
  try {
    const providerId = req.user?.id;
    if (!providerId) {
      return res.status(401).json({ message: "Unauthorized: Provider ID missing" });
    }
    const bookings = await Booking.findAll({
      include: [
        {
          model: Service,
          where: { providerId },
          required: true,  // ensure INNER JOIN, only bookings for this provider's services
        },
      ],
    });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching provider bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};
