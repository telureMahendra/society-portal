import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
    totalMembers: number;
    committeeMembers: number;
    collectedBills?: string;
    activeNotices?: number;
    visitorsToday?: number;
}

export interface RecentActivity {
    action: string;
    performedBy: string;
    timestamp: string;
    details: string;
}

export interface SocietyDashboardResponse {
    society: {
        id: number;
        name: string;
        subdomain: string;
        status: string;
    };
    role: string;
    stats: DashboardStats;
    recentActivities: RecentActivity[];
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private apiUrl = `${environment.apiBaseUrl}/society`;

    constructor(private http: HttpClient) {}

    getDashboardData(): Observable<SocietyDashboardResponse> {
        return this.http.get<SocietyDashboardResponse>(`${this.apiUrl}/dashboard`);
    }
}
