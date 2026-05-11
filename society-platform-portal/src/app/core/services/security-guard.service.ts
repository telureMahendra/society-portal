import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SecurityGuard, AddGuardRequest } from '../models/security-guard.model';
import { ApiResponse } from '../models/api-response.model'; // Need to check if this exists

@Injectable({
    providedIn: 'root'
})
export class SecurityGuardService {
    private apiUrl = `${environment.apiBaseUrl}/admin/guards`;

    constructor(private http: HttpClient) {}

    getGuards(societyId: number): Observable<SecurityGuard[]> {
        return this.http.get<any>(this.apiUrl, { params: { societyId: societyId.toString() } }).pipe(
            map(response => response.status === '00' ? response.data : []),
            catchError(error => {
                console.error('Failed to fetch guards:', error);
                return of([]);
            })
        );
    }

    addGuard(request: AddGuardRequest): Observable<boolean> {
        return this.http.post<any>(`${this.apiUrl}/add`, request).pipe(
            map(response => response.status === '00'),
            catchError(error => {
                console.error('Failed to add guard:', error);
                return of(false);
            })
        );
    }

    deleteGuard(membershipId: number): Observable<boolean> {
        return this.http.delete<any>(`${this.apiUrl}/${membershipId}`).pipe(
            map(response => response.status === '00'),
            catchError(error => {
                console.error('Failed to delete guard:', error);
                return of(false);
            })
        );
    }
}
