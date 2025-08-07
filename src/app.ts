 import express from "express"
 import cors from "cors"
 import authRoutes from "./route/auth.route";
 import userRoutes from "./route/user.routes";
 import serviceRoutes from "./route/service.route"
 import bookingRoute from "./route/booking.route";
import { getMyProfile, updateMyProfile } from "./controller/users/user.controller";

 
 const app = express()
 app.use(cors());
 app.use(express.json())
 app.use("/api/auth",authRoutes)
 app.use("/api/users",userRoutes)
 app.use("/api/services", serviceRoutes);
 app.use("/api/bookings", bookingRoute);
 app.use("/api/bookings", bookingRoute);
 app.use("/api/profile",getMyProfile)
 app.use("/api/profile",updateMyProfile)

 
 


 


 export default app