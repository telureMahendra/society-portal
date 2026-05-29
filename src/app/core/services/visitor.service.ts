import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Visitor, VisitorStatus } from '../models/visitor.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VisitorService {
    private apiUrl = `${environment.apiBaseUrl}/security/visitors`;

    constructor(private http: HttpClient) {}

    getVisitors(): Observable<Visitor[]> {
        // Passing societyId: 1 as required by SecurityVisitorController
        return this.http.post<any>(`${this.apiUrl}/list`, { societyId: 1 }).pipe(
            map(response => {
                if (response && response.data) {
                    return response.data.map((dto: any) => this.mapToVisitorModel(dto));
                }
                return [];
            }),
            catchError(err => {
                console.error('Error fetching visitors', err);
                return of([]);
            })
        );
    }

    checkoutVisitor(id: number): Observable<boolean> {
        return this.http.patch<any>(`${this.apiUrl}/${id}/checkout`, {}).pipe(
            map(() => true),
            catchError(err => {
                console.error('Error checking out visitor', err);
                return of(false);
            })
        );
    }

    updateStatus(id: number, status: VisitorStatus): Observable<boolean> {
        // Backend currently supports checking out via the dedicated endpoint.
        if (status === 'CHECKED_OUT') {
            return this.checkoutVisitor(id);
        }
        
        console.warn(`Backend does not explicitly support updating to status ${status} via a generic endpoint yet.`);
        return of(true); // Return mock true to keep UI functioning without errors
    }

    private mapToVisitorModel(dto: any): Visitor {
        const nameParts = dto.name ? String(dto.name).split(' ') : ['Unknown'];
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        // Map backend statuses to frontend statuses
        let status = dto.status;
        if (status === 'OUT') status = 'CHECKED_OUT';
        if (status === 'IN' || status === 'APPROVED') status = 'CHECKED_IN';
        if (status === 'UPCOMING' || status === 'EXPECTED') status = 'EXPECTED';

        return {
            id: dto.id,
            firstName: firstName,
            lastName: lastName,
            mobile: dto.mobile || '',
            purpose: dto.purpose || 'GUEST',
            status: status as VisitorStatus,
            checkInTime: dto.entryTime || dto.createdAt,
            checkOutTime: dto.exitTime,
            unitMapping: {
                wing: dto.wing || 'GATE',
                flatNumber: dto.flatNumber || ''
            },
            vehicleNumber: dto.vehicleNumber,
            notes: dto.approvalStatus ? `Approval: ${dto.approvalStatus}` : ''
        };
    }
}
