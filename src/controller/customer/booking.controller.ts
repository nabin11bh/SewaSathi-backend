// src/controller/customer/booking.controller.ts
import { Request, Response } from "express";
import { Booking } from "../../database/models/booking.model";
import { Service } from "../../database/models/service.model";
import { User } from "../../database/models/user.model";

const ALLOWED_STATUSES = ["pending", "confirmed", "in-progress", "completed", "cancelled"];

const providerInclude = {
  model: User,
  as: "provider",
  attributes: ["id", "name", "address"],
};

// POST /api/bookings
export const createBooking = async (req: Request, res: Response) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      return res.status(401).json({ message: "Unauthorized: Customer ID missing" });
    }

    const { serviceId, date, time, address, notes } = req.body;
    if (!serviceId || !date || !time || !address) {
      return res
        .status(400)
        .json({ message: "serviceId, date, time, and address are required" });
    }

    const service = await Service.findByPk(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const booking = await Booking.create({
      customerId,
      serviceId,
      date,
      time,
      address,
      notes: notes || null,
    } as any);

    const full = await Booking.findByPk(booking.id, {
      include: [{ model: Service, include: [providerInclude] }],
    });

    return res.status(201).json({ message: "Booking successful", booking: full });
  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/bookings/customer
export const getCustomerBookings = async (req: Request, res: Response) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      return res.status(401).json({ message: "Unauthorized: Customer ID missing" });
    }
    const bookings = await Booking.findAll({
      where: { customerId },
      include: [{ model: Service, include: [providerInclude] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching customer bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/bookings/provider
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
          required: true,
        },
        {
          model: User,
          as: "customer",
          attributes: ["id", "name", "address"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching provider bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/bookings/:id/status
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `status must be one of: ${ALLOWED_STATUSES.join(", ")}`,
      });
    }

    const booking = await Booking.findByPk(id, { include: [Service] });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const isAdmin = req.user?.role === "admin";
    const isOwningProvider = booking.service?.providerId === req.user?.id;

    if (!isAdmin && !isOwningProvider) {
      return res.status(403).json({ message: "Not authorized to update this booking" });
    }

    booking.status = status;
    await booking.save();

    return res.json({ message: "Booking updated", booking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return res.status(500).json({ message: "Server error" });
  }
};