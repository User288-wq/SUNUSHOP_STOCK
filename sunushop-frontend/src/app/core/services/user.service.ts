import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserDto {
  id: number;
  username: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  // En local, utilise : http://localhost:8081/api/v2/users
  private apiUrl = 'https://sunushop-backend.onrender.com/api/v2/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.apiUrl);
  }

  updateRole(id: number, role: string): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.apiUrl}/${id}/role`, { role });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
