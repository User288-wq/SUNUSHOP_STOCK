export interface Reservation {
  id?: number;
  articleId: number;
  clientId: number;
  quantity: number;
  warehouseCode: string;
  createdAt?: string;
  expiresAt?: string;
  status?: 'ACTIVE' | 'CONVERTED' | 'EXPIRED' | 'CANCELLED';
}

export interface ReservationRequest {
  articleId: number;
  clientId: number;
  quantity: number;
  warehouseCode: string;
}
