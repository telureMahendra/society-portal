import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

export interface User {
    id: number;
    username: string; // or mobileNumber
    roles: string[];
    societyId?: number;
    globalRole?: string;
}

export interface AuthResponse {
    accessToken: string;
    expiresIn: number;
    role: string;
    societyId?: number;
    societyName?: string;
    subdomain?: string;
    username: string;
    userId: number;
    id?: number; // Some endpoints return id instead of userId
    globalRole?: string;
    tokenType?: string;
    refreshToken?: string;
    // Legacy fields
    token?: string;
    user?: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private userSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.userSubject.asObservable();

    public setUser(user: User | null): void {
        this.userSubject.next(user);
    }

    private readonly TOKEN_KEY = 'auth-token';
    private readonly USER_KEY = 'auth-user';

    constructor(private http: HttpClient, private router: Router) {
        this.loadUserFromStorage();
    }

    public get currentUserValue(): User | null {
        return this.userSubject.value;
    }

    public get token(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    login(credentials: any): Observable<AuthResponse> {
        let apiUrl = `${environment.apiBaseUrl}/user/auth/login`;
        const host = window.location.hostname;
        const isPlatformHost = host.startsWith('platform') || host.startsWith('admin') || host === 'localhost' || host === '127.0.0.1';
        const isSocietySubdomain = !isPlatformHost && host.split('.').length >= 2;

        // Check if on platform subdomain
        if (isPlatformHost) {
            apiUrl = `${environment.apiBaseUrl}/platform/login`;
        } else if (isSocietySubdomain) {
            apiUrl = `${environment.apiBaseUrl}/society/auth/login`;
        }

        return this.http.post<any>(apiUrl, {
            identifier: credentials.username, // Component sends 'username', API expects 'identifier' or 'username' depending on endpoint
            username: credentials.username,   // Adding both to be safe
            password: credentials.password
        }).pipe(
            tap(response => {
                console.log('AuthService: Login response received:', response);
                const token = response.accessToken || response.token || '';
                const roles = this.extractRoles(response, token, isPlatformHost);

                const user: User = {
                    id: response.userId || response.id || 0,
                    username: response.username || credentials.username,
                    roles,
                    societyId: response.societyId,
                    globalRole: response.globalRole
                };

                console.log('AuthService: Mapped user:', user);

                if (token) {
                    this.saveToken(token);
                }
                this.saveUser(user);
                this.userSubject.next(user);
            })
        );
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }

    public saveToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    public saveUser(user: User): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    private loadUserFromStorage(): void {
        const userStr = localStorage.getItem(this.USER_KEY);
        if (userStr) {
            try {
                const raw = JSON.parse(userStr) as Partial<User>;
                const normalized: User = {
                    id: Number(raw.id) || 0,
                    username: raw.username || '',
                    roles: Array.isArray(raw.roles) ? raw.roles.filter((r): r is string => typeof r === 'string' && r.length > 0) : [],
                    societyId: raw.societyId,
                    globalRole: raw.globalRole
                };
                this.userSubject.next(normalized);
            } catch {
                localStorage.removeItem(this.USER_KEY);
                this.userSubject.next(null);
            }
        }
    }

    isAuthenticated(): boolean {
        return !!this.token && !!this.currentUserValue;
    }

    private extractRoles(response: any, token: string, isPlatformHost: boolean): string[] {
        const responseRoles = [
            response?.role,
            ...(Array.isArray(response?.roles) ? response.roles : []),
            ...(Array.isArray(response?.authorities) ? response.authorities : [])
        ].filter((r): r is string => typeof r === 'string' && r.length > 0);

        if (responseRoles.length > 0) {
            return responseRoles;
        }

        const tokenRoles = this.extractRolesFromToken(token);
        if (tokenRoles.length > 0) {
            return tokenRoles;
        }

        if (isPlatformHost) {
            return ['PLATFORM_ADMIN'];
        }

        return [];
    }

    private extractRolesFromToken(token: string): string[] {
        if (!token || token.split('.').length < 2) {
            return [];
        }

        try {
            const raw = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(atob(raw));
            const roles = [
                payload?.role,
                ...(Array.isArray(payload?.roles) ? payload.roles : []),
                ...(Array.isArray(payload?.authorities) ? payload.authorities : [])
            ].filter((r): r is string => typeof r === 'string' && r.length > 0);

            return roles;
        } catch {
            return [];
        }
    }
}
