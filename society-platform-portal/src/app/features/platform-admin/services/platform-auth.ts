import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService, User } from '../../../core/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlatformAuthService {
  private apiUrl = `${environment.apiBaseUrl}/platform`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Response matches backend: { access_token, refresh_token, role, ... }
        const token = response.access_token || response.accessToken;

        // Map to internal User model for AuthService compatibility
        const user: User = {
          id: 0, // Platform admin might not have numeric ID exposed in same way
          username: "Platform Admin", // Static or extracted from token
          roles: ['PLATFORM_ADMIN'],
          societyId: 0
        };

        this.authService.saveToken(token);
        this.authService.saveUser(user);
        this.authService.setUser(user);
        // AuthService doesn't expose subject, but it exposes user$ and saveUser calls next().
        // Wait, saveUser does NOT call next() in AuthService implementation I saw earlier? 
        // Let's check AuthService implementation again.
      })
    );
  }
}
