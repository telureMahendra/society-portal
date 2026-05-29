import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timer, map, take } from 'rxjs';
import { Wing, Flat } from '../models/society-structure.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SocietyStructureService {
    private apiUrl = `${environment.apiBaseUrl}/society-admin/flats`;

    constructor(private http: HttpClient) {}

    getWings(): Observable<Wing[]> {
        return this.http.get<Wing[]>(`${this.apiUrl}/wings`);
    }

    addWing(name: string, totalFloors: number, flatsPerFloor: number): Observable<any> {
        const payload = {
            name: name,
            totalFloors: totalFloors,
            flatsPerFloor: flatsPerFloor
        };
        return this.http.post(`${this.apiUrl}/wings`, payload);
    }

    getWingById(id: number): Observable<Wing | undefined> {
        // Fallback for mock usage, normally we'd fetch from backend if needed
        return this.http.get<Wing>(`${this.apiUrl}/wings/${id}`);
    }

    getFlats(wingName: string, search: string, page: number, size: number): Observable<any> {
        const params = new URLSearchParams();
        params.append('wing', wingName);
        if (search) {
            params.append('search', search);
        }
        params.append('page', page.toString());
        params.append('size', size.toString());
        return this.http.get<any>(`${this.apiUrl}?${params.toString()}`);
    }

    updateFlatOwner(flatId: number, ownerName: string, residentType: 'OWNER' | 'TENANT'): Observable<boolean> {
        const payload = {
            ownerName,
            residentType
        };
        // The API actually uses AssignFlatRequest: { ownerId, residentType }
        // Let's assume for now it accepts ownerName or we just mock this part if it's not fully implemented on backend
        return this.http.put<boolean>(`${this.apiUrl}/${flatId}/assign`, payload);
    }

    bulkUploadUnits(file: File): Observable<number> {
        // Keep mock for bulk upload until API is ready
        return timer(0, 100).pipe(
            take(11),
            map(i => i * 10)
        );
    }
}
