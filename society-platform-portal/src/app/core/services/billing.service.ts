import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Bill } from '../models/bill.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BillingService {
    private http = inject(HttpClient);
    private base = `${environment.apiBaseUrl}/society/billing`;
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
        return this.http.get<any[]>(`${this.base}/configs`);
    }

    updateBillingConfigs(payload: { configs: any[] }): Observable<any> {
        return this.http.put<any>(`${this.base}/configs`, payload);
    }

    generateAdhocBills(payload: any): Observable<any> {
        return this.http.post<any>(`${this.base}/adhoc`, payload);
    }
}
