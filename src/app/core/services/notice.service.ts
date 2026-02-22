import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Notice } from '../models/notice.model';

@Injectable({
    providedIn: 'root'
})
export class NoticeService {
    private mockNotices: Notice[] = [
        {
            id: 1,
            title: 'Annual General Meeting (AGM) 2024',
            content: 'The Annual General Meeting for the year 2024 is scheduled for March 24th at 10:00 AM in the Community Hall. All members are requested to attend.',
            publishDate: '2024-03-01T09:00:00Z',
            priority: 'HIGH',
            category: 'GENERAL',
            author: 'Secretary',
            isPinned: true
        },
        {
            id: 2,
            title: 'Water Supply Interruption - Block B',
            content: 'Due to scheduled maintenance, water supply to Block B will be interrupted on March 15th from 10:00 AM to 4:00 PM. Please store water accordingly.',
            publishDate: '2024-03-10T08:30:00Z',
            expiryDate: '2024-03-15T18:00:00Z',
            priority: 'CRITICAL',
            category: 'MAINTENANCE',
            author: 'Facility Manager'
        },
        {
            id: 3,
            title: 'Holi Celebration 2024',
            content: 'Let\'s celebrate Holi together! Join us for colors, music, and snacks at the central park on March 25th from 11:00 AM onwards.',
            publishDate: '2024-03-05T10:00:00Z',
            priority: 'MEDIUM',
            category: 'EVENT',
            author: 'Cultural Committee'
        },
        {
            id: 4,
            title: 'New Security Protocol for Visitors',
            content: 'Please note the new security protocol for all visitors entering the premises. All visitors must be registered via the EstatePilot app by the resident.',
            publishDate: '2024-02-28T14:00:00Z',
            priority: 'HIGH',
            category: 'SECURITY',
            author: 'Security Head'
        }
    ];

    getNotices(): Observable<Notice[]> {
        return of(this.mockNotices);
    }

    getNoticeById(id: number): Observable<Notice | undefined> {
        return of(this.mockNotices.find(n => n.id === id));
    }
}
