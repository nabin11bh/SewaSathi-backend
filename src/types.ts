export interface IUser {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role: "customer" | "provider" | "admin"; 
    createdAt?: Date;
    updatedAt?: Date;
  }
  