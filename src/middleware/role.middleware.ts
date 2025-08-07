

      import { Request, Response, NextFunction } from "express";

      //checks if the user has the required role
      export const authorize = (...allowedRoles: string[]) => {
        return (req: Request, res: Response, next: NextFunction) => {
          if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: No user info" });
          }

          const userRole = req.user.role;

          if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: `Forbidden: ${userRole} is not allowed` });
          }

          next(); // Role is allowed, proceed
        };
      };
