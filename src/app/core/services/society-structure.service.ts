import { Injectable } from '@angular/core';
import { Observable, of, timer, map, take, concat } from 'rxjs';
import { Wing, Flat } from '../models/society-structure.model';

@Injectable({
    providedIn: 'root'
})
export class SocietyStructureService {
    private mockWings: Wing[] = [
        {
            id: 1,
            name: 'Wing A',
            totalFloors: 10,
            flatsPerFloor: 4,
            totalFlats: 40,
            flats: [
                { id: 101, flatNumber: '101', floor: 1, ownerName: 'Amit Shah', residentType: 'OWNER', occupancyStatus: 'OCCUPIED', areaSqFt: 1200, wingId: 1 },
                { id: 102, flatNumber: '102', floor: 1, ownerName: 'John Doe', residentType: 'TENANT', occupancyStatus: 'OCCUPIED', areaSqFt: 1150, wingId: 1 },
                { id: 103, flatNumber: '103', floor: 1, ownerName: 'N/A', residentType: 'VACANT', occupancyStatus: 'VACANT', areaSqFt: 1200, wingId: 1 },
                { id: 104, flatNumber: '104', floor: 1, ownerName: 'Rahul Verma', residentType: 'OWNER', occupancyStatus: 'OCCUPIED', areaSqFt: 1150, wingId: 1 }
            ]
        },
        {
            id: 2,
            name: 'Wing B',
            totalFloors: 10,
            flatsPerFloor: 4,
            totalFlats: 40,
            flats: [
                { id: 201, flatNumber: '101', floor: 1, ownerName: 'Sanjay Gupta', residentType: 'OWNER', occupancyStatus: 'OCCUPIED', areaSqFt: 1250, wingId: 2 },
                { id: 202, flatNumber: '102', floor: 1, ownerName: 'N/A', residentType: 'VACANT', occupancyStatus: 'VACANT', areaSqFt: 1200, wingId: 2 }
            ]
        }
    ];

    getWings(): Observable<Wing[]> {
        return of(this.mockWings);
    }

    getWingById(id: number): Observable<Wing | undefined> {
        return of(this.mockWings.find(w => w.id === id));
    }

    getFlatsByWing(wingId: number): Observable<Flat[]> {
        const wing = this.mockWings.find(w => w.id === wingId);
        return of(wing ? (wing.flats || []) : []);
    }

    updateFlatOwner(flatId: number, ownerName: string, residentType: 'OWNER' | 'TENANT'): Observable<boolean> {
        for (const wing of this.mockWings) {
            if (wing.flats) {
                const flat = wing.flats.find(f => f.id === flatId);
                if (flat) {
                    flat.ownerName = ownerName;
                    flat.residentType = residentType;
                    flat.occupancyStatus = 'OCCUPIED';
                    return of(true);
                }
            }
        }
        return of(false);
    }

    bulkUploadUnits(file: File): Observable<number> {
        // Simulate progress from 0 to 100
        return timer(0, 100).pipe(
            take(11),
            map(i => i * 10)
        );
    }
}
