export interface Movement {
  id?: number;
  articleId: number;
  warehouseCode: string;
  quantity: number;
  movementType: 'RECEPTION' | 'SORTIE' | 'AJUSTEMENT';
  referenceDocument?: string;
  reason?: string;
  movementDate?: string;
  stockBefore?: number;
  stockAfter?: number;
}

export interface MovementRequest {
  articleId: number;
  warehouseCode: string;
  quantity: number;
  movementType: string;
  reference?: string;
  reason?: string;
}

export interface MovementResponse {
  movementId: number;
  articleId: number;
  warehouseCode: string;
  quantity: number;
  movementType: string;
  stockPhysical: number;
  stockReserved: number;
  stockAvailable: number;
  timestamp: string;
  message: string;
}
