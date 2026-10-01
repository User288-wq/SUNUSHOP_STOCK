import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReservationService } from './reservation.service';
import { Reservation, ReservationRequest } from '../../shared/models/reservation.model';

describe('ReservationService', () => {
  let service: ReservationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReservationService]
    });
    service = TestBed.inject(ReservationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait creer une reservation', () => {
    const request: ReservationRequest = {
      articleId: 1,
      clientId: 100,
      quantity: 20,
      warehouseCode: 'DAK'
    };

    const mockReservation: Reservation = {
      id: 1,
      articleId: 1,
      clientId: 100,
      quantity: 20,
      warehouseCode: 'DAK',
      createdAt: '2026-01-01T10:00:00',
      expiresAt: '2026-01-03T10:00:00',
      status: 'ACTIVE'
    };

    service.create(request).subscribe(reservation => {
      expect(reservation.id).toBe(1);
      expect(reservation.clientId).toBe(100);
    });

    const req = httpMock.expectOne('/api/v2/reservations');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(mockReservation);
  });

  it('devrait recuperer les reservations actives', () => {
    const mockReservations: Reservation[] = [{
      id: 1,
      articleId: 1,
      clientId: 100,
      quantity: 20,
      warehouseCode: 'DAK',
      createdAt: '2026-01-01T10:00:00',
      expiresAt: '2026-01-03T10:00:00',
      status: 'ACTIVE'
    }];

    service.getActive().subscribe(reservations => {
      expect(reservations.length).toBe(1);
    });

    const req = httpMock.expectOne('/api/v2/reservations/active');
    expect(req.request.method).toBe('GET');
    req.flush(mockReservations);
  });

  it('devrait annuler une reservation', () => {
    service.cancel(1).subscribe(reservation => {
      expect(reservation).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/v2/reservations/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ id: 1, status: 'CANCELLED' });
  });
});