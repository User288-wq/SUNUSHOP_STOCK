import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movement, MovementRequest, MovementResponse } from '../../shared/models/movement.model';

@Injectable({ providedIn: 'root' })
export class StockService {
  private apiUrl = 'https://sunushop-backend.onrender.com/api/v2/stocks';

  constructor(private http: HttpClient) {}

  recordMovement(request: MovementRequest): Observable<MovementResponse> {
    return this.http.post<MovementResponse>(`${this.apiUrl}/movements`, request);
  }

  getMovementsByArticle(articleId: number): Observable<Movement[]> {
    return this.http.get<Movement[]>(`${this.apiUrl}/articles/${articleId}/movements`);
  }
}
