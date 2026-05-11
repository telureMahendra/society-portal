import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SocietyEvent } from '../models/society-event.model';

@Injectable({
    providedIn: 'root'
})
export class SocietyEventService {
    private mockEvents: SocietyEvent[] = [
        {
            id: 1,
            title: 'Holi Celebration 2024',
            description: 'Join us for a vibrant celebration of Holi with colors, music, and traditional snacks. Fun for all ages!',
            startDate: '2024-03-25T11:00:00Z',
            endDate: '2024-03-25T16:00:00Z',
            location: 'Central Park / Clubhouse Ground',
            category: 'FESTIVAL',
            status: 'UPCOMING',
            organizer: 'Cultural Committee',
            imageUrl: 'https://images.unsplash.com/photo-1590054790395-63ad0eeb30ca?auto=format&fit=crop&w=800&q=80',
            currentAttendees: 120
        },
        {
            id: 2,
            title: 'Annual General Meeting (AGM)',
            description: 'The mandatory Annual General Meeting to discuss society budget, maintenance updates, and new committee elections.',
            startDate: '2024-03-24T10:00:00Z',
            endDate: '2024-03-24T13:00:00Z',
            location: 'Community Hall, 1st Floor',
            category: 'MEETING',
            status: 'UPCOMING',
            organizer: 'Management Committee'
        },
        {
            id: 3,
            title: 'Inter-Society Cricket Tournament',
            description: 'Cheer for our team in the final match of the annual cricket tournament against neighboring blocks.',
            startDate: '2024-03-17T08:00:00Z',
            endDate: '2024-03-17T18:00:00Z',
            location: 'Main Sports Complex',
            category: 'SPORTS',
            status: 'UPCOMING',
            organizer: 'Sports Hub',
            imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80',
            currentAttendees: 45
        },
        {
            id: 4,
            title: 'Blood Donation Camp',
            description: 'In association with the Red Cross, we are organizing a blood donation drive. Your small act can save a life.',
            startDate: '2024-02-15T09:00:00Z',
            endDate: '2024-02-15T15:00:00Z',
            location: 'Clubhouse Lobby',
            category: 'CHARITY',
            status: 'COMPLETED',
            organizer: 'Welfare Committee',
            currentAttendees: 85
        }
    ];

    getEvents(): Observable<SocietyEvent[]> {
        return of(this.mockEvents);
    }

    getEventById(id: number): Observable<SocietyEvent | undefined> {
        return of(this.mockEvents.find(e => e.id === id));
    }
}
