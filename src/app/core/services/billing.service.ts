import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Bill } from '../models/bill.model';

@Injectable({
    providedIn: 'root'
})
export class BillingService {
    private mockBills: Bill[] = [
        {
            id: 1,
            invoiceId: 'INV-2024-001',
            residentName: 'Mahendra Telure',
            unitNumber: 'Flat 502',
            amount: 4500,
            dueDate: '2024-03-10',
            billingDate: '2024-03-01',
            status: 'PAID'
        },
        {
            id: 2,
            invoiceId: 'INV-2024-002',
            residentName: 'Alice Johnson',
            unitNumber: 'Flat 101',
            amount: 4200,
            dueDate: '2024-03-10',
            billingDate: '2024-03-01',
            status: 'PENDING'
        },
        {
            id: 3,
            invoiceId: 'INV-2024-003',
            residentName: 'Bob Smith',
            unitNumber: 'Flat 203',
            amount: 4800,
            dueDate: '2024-02-10',
            billingDate: '2024-02-01',
            status: 'OVERDUE',
            penalty: 250
        },
        {
            id: 4,
            invoiceId: 'INV-2024-004',
            residentName: 'Charlie Brown',
            unitNumber: 'Flat 305',
            amount: 4200,
            dueDate: '2024-03-10',
            billingDate: '2024-03-01',
            status: 'PENDING'
        }
    ];

    getBills(): Observable<Bill[]> {
        return of(this.mockBills);
    }

    getBillById(id: number): Observable<Bill | undefined> {
        return of(this.mockBills.find(b => b.id === id));
    }

    getBillingConfigs(): Observable<any[]> {
        return of([]);
    }

    updateBillingConfigs(payload: any): Observable<any> {
        return of({ success: true });
    }

    generateAdhocBills(payload: any): Observable<any> {
        return of({ success: true });
    }
}
