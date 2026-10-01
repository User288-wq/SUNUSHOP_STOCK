export interface Article {
  id?: number;
  reference: string;
  designation: string;
  category: string;
  currentStockPhysical: number;
  currentStockReserved: number;
  currentStockAvailable?: number;
  createdAt?: string;
  updatedAt?: string;
}
