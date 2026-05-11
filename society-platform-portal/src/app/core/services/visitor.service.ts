import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Visitor } from '../models/visitor.model';

@Injectable({
    providedIn: 'root'
})
export class VisitorService {
    private mockVisitors: Visitor[] = [
        {
            id: 1,
            firstName: 'Rajesh',
            lastName: 'Kumar',
            mobile: '+91 98765 43220',
            purpose: 'DELIVERY',
            status: 'CHECKED_IN',
            checkInTime: '2026-02-23T08:30:00',
            unitMapping: { wing: 'Wing A', flatNumber: '101' },
            vehicleNumber: 'MH 12 AB 1234',
            notes: 'Amazon Delivery'
        },
        {
            id: 2,
            firstName: 'Sarah',
            lastName: 'Wilson',
            mobile: '+91 98765 43221',
            purpose: 'GUEST',
            status: 'CHECKED_OUT',
            checkInTime: '2026-02-23T10:15:00',
            checkOutTime: '2026-02-23T12:45:00',
            unitMapping: { wing: 'Wing B', flatNumber: '102' }
        },
        {
            id: 3,
            firstName: 'Vikram',
            lastName: 'Mehta',
            mobile: '+91 98765 43222',
            purpose: 'SERVICE',
            status: 'CHECKED_IN',
            checkInTime: '2026-02-23T11:00:00',
            unitMapping: { wing: 'Wing A', flatNumber: '104' },
            notes: 'A/C Repair'
        },
        {
            id: 4,
            firstName: 'Sunil',
            lastName: 'Pawar',
            mobile: '+91 98765 43223',
            purpose: 'DELIVERY',
            status: 'CHECKED_IN',
            checkInTime: '2026-02-22T21:00:00', // Over 12 hours ago
            unitMapping: { wing: 'Wing B', flatNumber: '101' },
            notes: 'Zomato - Night duty'
        }
    ];

    getVisitors(): Observable<Visitor[]> {
        return of(this.mockVisitors);
    }

    addVisitor(visitor: Omit<Visitor, 'id' | 'status' | 'checkInTime'>): Observable<Visitor> {
        const newVisitor: Visitor = {
            ...visitor,
            id: Math.max(...this.mockVisitors.map(v => v.id)) + 1,
            status: 'CHECKED_IN',
            checkInTime: new Date().toISOString()
        };
        this.mockVisitors.unshift(newVisitor);
        return of(newVisitor);
    }

    checkoutVisitor(id: number): Observable<boolean> {
        const visitor = this.mockVisitors.find(v => v.id === id);
        if (visitor) {
            visitor.status = 'CHECKED_OUT';
            visitor.checkOutTime = new Date().toISOString();
            return of(true);
        }
        return of(false);
    }
}
