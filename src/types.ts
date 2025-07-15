export interface IUser {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    provideID:number,
    role: "customer" | "provider" | "admin"; 
    createdAt?: Date;
    updatedAt?: Date;
  }
  