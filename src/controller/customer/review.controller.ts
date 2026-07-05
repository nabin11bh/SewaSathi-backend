// src/controller/customer/review.controller.ts
import { Request, Response } from "express";
import { Review } from "../../database/models/review.model";
import { Service } from "../../database/models/service.model";
import { User } from "../../database/models/user.model";

const authorInclude = {
  model: User,
  as: "customer",
  attributes: ["id", "name"],
};

// POST /api/reviews
export const createReview = async (req: Request, res: Response) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      return res.status(401).json({ message: "Unauthorized: Customer ID missing" });
    }

    const { serviceId, rating, comment } = req.body;
    if (!serviceId || !rating) {
      return res.status(400).json({ message: "serviceId and rating are required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "rating must be between 1 and 5" });
    }

    const service = await Service.findByPk(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const review = await Review.create({
      customerId,
      serviceId,
      rating,
      comment: comment || null,
    } as any);

    const full = await Review.findByPk(review.id, { include: [authorInclude] });

    return res.status(201).json({ message: "Review submitted", review: full });
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/reviews/service/:serviceId
export const getReviewsForService = async (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;
    const reviews = await Review.findAll({
      where: { serviceId },
      include: [authorInclude],
      order: [["createdAt", "DESC"]],
    });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/reviews/:id
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const isAdmin = req.user?.role === "admin";
    const isAuthor = review.customerId === req.user?.id;

    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await review.destroy();
    return res.json({ message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({ message: "Server error" });
  }
};