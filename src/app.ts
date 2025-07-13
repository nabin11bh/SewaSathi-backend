 import express from "express"
 import cors from "cors"
 import authRoutes from "./route/auth.route";
 import userRoutes from "./route/user.routes";

 
 const app = express()
 app.use(cors());
 app.use(express.json())
 app.use("/api/auth",authRoutes)
 app.use("/api/users",userRoutes)
 


 export default app