// src/app.ts
import express from "express";
import cors from "cors";
import authRoutes from "./route/auth.route";
import userRoutes from "./route/user.routes";
import adminRoutes from "./route/admin.route";
import serviceRoutes from "./route/service.route";
import bookingRoute from "./route/booking.route";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoute);

// Simple health check — useful to confirm the server + DB are up
// before testing anything else from the frontend.
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;