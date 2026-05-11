import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Payment } from '../models/payment.model';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private mockPayments: Payment[] = [
        {
            id: 1,
            transactionId: 'TXN-987654321',
            invoiceId: 'INV-2024-001',
            residentName: 'Mahendra Telure',
            unitNumber: 'Flat 502',
            amount: 4500,
            paymentDate: '2024-03-05T10:30:00Z',
            paymentMethod: 'UPI',
            status: 'COMPLETED',
            receiptUrl: '#'
        },
        {
            id: 2,
            transactionId: 'TXN-987654322',
            invoiceId: 'INV-2024-010',
            residentName: 'Alice Johnson',
            unitNumber: 'Flat 101',
            amount: 4200,
            paymentDate: '2024-03-06T14:20:00Z',
            paymentMethod: 'CARD',
            status: 'COMPLETED',
            receiptUrl: '#'
        },
        {
            id: 3,
            transactionId: 'TXN-987654323',
            invoiceId: 'INV-2024-015',
            residentName: 'Bob Smith',
            unitNumber: 'Flat 203',
            amount: 4800,
            paymentDate: '2024-03-07T09:15:00Z',
            paymentMethod: 'NET_BANKING',
            status: 'FAILED'
        },
        {
            id: 4,
            transactionId: 'TXN-987654324',
            invoiceId: 'INV-2024-020',
            residentName: 'Charlie Brown',
            unitNumber: 'Flat 305',
            amount: 4200,
            paymentDate: '2024-03-08T11:45:00Z',
            paymentMethod: 'UPI',
            status: 'PENDING'
        }
    ];

    getPayments(): Observable<Payment[]> {
        return of(this.mockPayments);
    }

    getPaymentById(id: number): Observable<Payment | undefined> {
        return of(this.mockPayments.find(p => p.id === id));
    }
}
