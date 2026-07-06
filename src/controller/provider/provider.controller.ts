// src/controller/provider/provider.controller.ts
import { Request, Response } from "express";
import { Op, fn, col } from "sequelize";
import { Service } from "../../database/models/service.model";
import { User } from "../../database/models/user.model";
import { Review } from "../../database/models/review.model";

const providerInclude = {
  model: User,
  as: "provider",
  attributes: ["id", "name", "address"],
};

type RatingStats = { rating: number; reviewCount: number };

// POST /api/services/add
export const createService = async (req: Request, res: Response) => {
  try {
    const providerId = req.user?.id;
    if (!providerId) {
      return res.status(401).json({ message: "Unauthorized: Provider ID missing" });
    }

    const { title, description, price, category, location } = req.body;
    if (!title || !description || !price || !category || !location) {
      return res
        .status(400)
        .json({ message: "Title, description, price, category, and location are required" });
    }

    // multer-storage-cloudinary puts the uploaded file's full Cloudinary URL
    // on req.file.path once the upload completes.
    const image = req.file ? (req.file as any).path : null;

    const newService = await Service.create({
      providerId,
      title,
      description,
      price: Number(price),
      category,
      location,
      image,
    } as any);

    return res.status(201).json({ message: "Service created", service: newService });
  } catch (error) {
    console.error("Error creating service:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/services?search=&category=&priceRange=0-500&providerId=&page=1&limit=9
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const { search, category, priceRange, providerId, page, limit } = req.query as {
      [key: string]: string;
    };

    const where: any = {};
    if (category) where.category = category;
    if (providerId) where.providerId = providerId;
    if (search) where.title = { [Op.like]: `%${search}%` };

    if (priceRange) {
      const [minStr, maxStr] = priceRange.split("-");
      const min = minStr ? Number(minStr) : undefined;
      const max = maxStr && maxStr !== "" ? Number(maxStr) : undefined;

      const priceWhere: any = {};
      let hasPriceFilter = false;

      if (min !== undefined && !Number.isNaN(min)) {
        priceWhere[Op.gte] = min;
        hasPriceFilter = true;
      }
      if (max !== undefined && !Number.isNaN(max)) {
        priceWhere[Op.lte] = max;
        hasPriceFilter = true;
      }

      if (hasPriceFilter) where.price = priceWhere;
    }

    const pageNum = page ? Math.max(1, parseInt(page, 10)) : 1;
    const limitNum = limit ? Math.max(1, parseInt(limit, 10)) : undefined;

    const queryOptions: any = {
      where,
      include: [providerInclude],
      order: [["createdAt", "DESC"]],
    };

    if (limitNum) {
      queryOptions.limit = limitNum;
      queryOptions.offset = (pageNum - 1) * limitNum;
    }

    const { rows, count } = await Service.findAndCountAll(queryOptions);

    const serviceIds = rows.map((s) => s.id);
    const ratingMap = new Map<number, RatingStats>();

    if (serviceIds.length) {
      const ratingRows = (await Review.findAll({
        where: { serviceId: serviceIds },
        attributes: [
          "serviceId",
          [fn("AVG", col("rating")), "avgRating"],
          [fn("COUNT", col("id")), "reviewCount"],
        ],
        group: ["serviceId"],
        raw: true,
      })) as any[];

      for (const r of ratingRows) {
        ratingMap.set(r.serviceId, {
          rating: Number(r.avgRating),
          reviewCount: Number(r.reviewCount),
        });
      }
    }

    const withRatings = rows.map((s) => {
      const json = s.toJSON() as any;
      const stats: RatingStats | undefined = ratingMap.get(s.id);
      json.rating = stats ? stats.rating : null;
      json.reviewCount = stats ? stats.reviewCount : 0;
      return json;
    });

    return res.status(200).json({ items: withRatings, total: count });
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/services/:id
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id, { include: [providerInclude] });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const reviewStats = (await Review.findAll({
      where: { serviceId: service.id },
      attributes: [
        [fn("AVG", col("rating")), "avgRating"],
        [fn("COUNT", col("id")), "reviewCount"],
      ],
      raw: true,
    })) as any[];

    const json = service.toJSON() as any;
    json.rating = reviewStats[0]?.avgRating ? Number(reviewStats[0].avgRating) : null;
    json.reviewCount = Number(reviewStats[0]?.reviewCount || 0);

    return res.status(200).json(json);
  } catch (error) {
    console.error("Error fetching service:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /api/services/:id
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, location } = req.body;

    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.providerId !== req.user?.id) {
      return res.status(403).json({ message: "Not authorized to update this service" });
    }

    // Only replace the image if a new file was actually uploaded —
    // otherwise keep whatever the service already had.
    const image = req.file ? (req.file as any).path : service.image;

    await service.update({
      title: title ?? service.title,
      description: description ?? service.description,
      price: price ? Number(price) : service.price,
      category: category ?? service.category,
      location: location ?? service.location,
      image,
    });

    return res.status(200).json({ message: "Service updated", service });
  } catch (error) {
    console.error("Error updating service:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /api/services/:id
export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const isAdmin = req.user?.role === "admin";
    const isOwner = service.providerId === req.user?.id;

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