// src/types/service.type.ts
export interface ServiceCreationAttrs {
  providerId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  image?: string | null;
}