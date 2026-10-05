import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('devrait etre cree', () => {
    expect(service).toBeTruthy();
  });

  it('devrait retourner null si pas de token', () => {
    expect(service.getToken()).toBeNull();
  });

  it('devrait retourner false si pas connecte', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('devrait appeler POST /api/v2/auth/login', () => {
    const credentials = { username: 'admin', password: 'admin123' };

    service.login(credentials).subscribe(response => {
      expect(response.token).toBe('fake-jwt-token');
      expect(response.username).toBe('admin');
    });

    const req = httpMock.expectOne('/api/v2/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);

    req.flush({
      token: 'fake-jwt-token',
      username: 'admin',
      role: 'USER',
      expiresIn: 86400000
    });
  });

  it('devrait appeler POST /api/v2/auth/register', () => {
    const request = { username: 'test', password: 'test123', email: 't@t.com' };

    service.register(request).subscribe(response => {
      expect(response.username).toBe('test');
    });

    const req = httpMock.expectOne('/api/v2/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush({
      token: 'fake-token',
      username: 'test',
      role: 'USER',
      expiresIn: 86400000
    });
  });
});