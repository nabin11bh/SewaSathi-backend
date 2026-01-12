        import { Request, Response } from "express";
        import { Booking } from "../../database/models/booking.model";
        import { Service } from "../../database/models/service.model";
        import { User } from "../../database/models/user.model";

        // GET /api/admin/stats
        export const getDashboardStats = async (req: Request, res: Response) => {
        try {
            const totalUsers = await User.count();
            const totalServices = await Service.count();
            const totalBookings = await Booking.count();

            res.json({ totalUsers, totalServices, totalBookings });
        } catch (error) {
            console.error("Admin stats error:", error);
            res.status(500).json({ message: "Server error" });
        }
        };

        // GET /api/admin/bookings
        export const getAllBookings = async (req: Request, res: Response) => {
        try {
            const bookings = await Booking.findAll({
            include: [
                {
                model: User,
                as: 'customer', // Booking belongsTo User as customer
                attributes: ["id", "name", "email"],
                },
                {
                model: Service,
                include: [
                    {
                    model: User,
                    as: 'provider', // Service belongsTo User as provider
                    attributes: ["id", "name", "email"]
                    }
                ]
                },
            ],
            order: [['createdAt', 'DESC']]
            });
            res.json(bookings);
        } catch (error) {
            console.error("Admin bookings error:", error);
            res.status(500).json({ message: "Server error" });
        }
        };