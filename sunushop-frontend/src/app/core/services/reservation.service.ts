import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation, ReservationRequest } from '../../shared/models/reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private apiUrl = '/api/v2/reservations';

  constructor(private http: HttpClient) {}

  create(request: ReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, request);
  }

  cancel(id: number): Observable<Reservation> {
    return this.http.delete<Reservation>(`${this.apiUrl}/${id}`);
  }

  getActive(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/active`);
  }
}