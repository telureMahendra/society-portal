import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SocietyEvent, StandardResponse, Page, EventListRequest } from '../models/society-event.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SocietyEventService {
    private adminUrl = `${environment.apiBaseUrl}/admin/events`;
    private userUrl = `${environment.apiBaseUrl}/user/events`;

    constructor(private http: HttpClient) {}

    getEvents(request: EventListRequest): Observable<Page<SocietyEvent> | null> {
        return this.http.post<StandardResponse<Page<SocietyEvent>>>(`${this.adminUrl}/list`, request).pipe(
            map(res => res.data),
            catchError(err => {
                console.error('Error fetching events', err);
                return of(null);
            })
        );
    }

    getEventById(id: number): Observable<SocietyEvent | undefined> {
        return this.http.post<StandardResponse<SocietyEvent>>(`${this.adminUrl}/details`, { eventId: id }).pipe(
            map(res => res.data),
            catchError(() => of(undefined))
        );
    }

    createEvent(event: Partial<SocietyEvent>, imageFile?: File): Observable<SocietyEvent> {
        const payload = {
            title: event.title,
            description: event.description,
            startDate: event.eventDate || event.startDate, // Map to eventDate for backend
            endDate: event.endDate,
            location: event.location,
            category: event.category,
            status: event.status,
            organizer: event.organizer,
            maxAttendees: event.currentAttendees || event.maxAttendees || 0
        };

        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
        
        if (imageFile) {
            formData.append('image', imageFile);
        }

        return this.http.post<StandardResponse<SocietyEvent>>(`${this.adminUrl}/create`, formData).pipe(
            map(res => res.data)
        );
    }

    updateEvent(event: Partial<SocietyEvent>, imageFile?: File): Observable<SocietyEvent> {
        const payload = {
            eventId: event.id,
            title: event.title,
            description: event.description,
            startDate: event.eventDate || event.startDate, // Map to eventDate for backend
            endDate: event.endDate,
            location: event.location,
            category: event.category,
            status: event.status,
            organizer: event.organizer,
            maxAttendees: event.currentAttendees || event.maxAttendees || 0
        };

        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
        
        if (imageFile) {
            formData.append('image', imageFile);
        }

        return this.http.post<StandardResponse<SocietyEvent>>(`${this.adminUrl}/update`, formData).pipe(
            map(res => res.data)
        );
    }

    deleteEvent(id: number): Observable<boolean> {
        return this.http.post<StandardResponse<void>>(`${this.adminUrl}/delete`, { eventId: id }).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }
}
