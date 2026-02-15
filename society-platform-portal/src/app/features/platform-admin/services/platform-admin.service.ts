import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Federation {
    id: number;
    name: string;
    code: string;
    subdomain: string;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
    createdAt: string;
    societiesCount: number;
}

export interface Society {
    id: number;
    name: string;
    federationName?: string;
    subdomain?: string;
    city?: string;
    totalFlats?: number;
    status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
}

export interface SocietyOnboardingRequest {
    name: string;
    code: string;
    federationId?: number | null;
    requestedSubdomain: string;
    description?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    isTownship: boolean;
}

export interface SocietyOnboardingResponse {
    id: number;
    name: string;
    code: string;
    subdomain: string;
    logoUrl?: string;
    bannerUrl?: string;
    status: string;
    federationId?: number;
    createdAt: string;
}

export interface SubdomainInfo {
    subdomain: string;
    type: 'FEDERATION' | 'SOCIETY';
    linkedEntityName: string;
    status: 'ACTIVE' | 'Available' | 'Reserved';
    createdAt: string;
}

export interface PlatformDashboardSummary {
    totalFederations: number;
    totalSocieties: number;
    totalActiveUsers: number;
    totalActiveFlats: number;
    platformHealthStatus: 'HEALTHY' | 'DEGRADED' | 'DOWN';
}

export interface MonitoringSummary {
    activeTenants: number;
    apiHealth: string;
    recentOnboardings: any[];
    systemAlerts: any[];
}

@Injectable({
    providedIn: 'root'
})
export class PlatformAdminService {
    private apiUrl = `${environment.apiBaseUrl}/platform`;

    constructor(private http: HttpClient) { }

    // Dashboard
    getDashboardSummary(): Observable<PlatformDashboardSummary> {
        return this.http.get<PlatformDashboardSummary>(`${this.apiUrl}/dashboard/summary`);
    }

    // Federations
    getFederations(page: number = 0, size: number = 10, status?: string): Observable<any> {
        let params = new HttpParams().set('page', page).set('size', size);
        if (status) params = params.set('status', status);
        return this.http.get<any>(`${this.apiUrl}/federations`, { params });
    }

    createFederation(data: any): Observable<Federation> {
        return this.http.post<Federation>(`${this.apiUrl}/federations`, data);
    }

    updateFederation(id: number, data: any): Observable<Federation> {
        return this.http.put<Federation>(`${this.apiUrl}/federations/${id}`, data);
    }

    updateFederationStatus(id: number, status: string): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}/federations/${id}/status`, { status });
    }

    // Societies
    getSocieties(page: number = 0, size: number = 10, filters?: any): Observable<any> {
        let params = new HttpParams().set('page', page).set('size', size);
        if (filters) {
            if (filters.federation) params = params.set('federation', filters.federation);
            if (filters.city) params = params.set('city', filters.city);
            if (filters.status) params = params.set('status', filters.status);
        }
        return this.http.get<any>(`${this.apiUrl}/societies`, { params });
    }

    createSociety(request: SocietyOnboardingRequest, logo?: File | null, banner?: File | null): Observable<SocietyOnboardingResponse> {
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(request)], { type: 'application/json' }));

        if (logo) {
            formData.append('logo', logo);
        }

        if (banner) {
            formData.append('banner', banner);
        }

        return this.http.post<SocietyOnboardingResponse>(`${this.apiUrl}/societies`, formData);
    }

    updateSocietyStatus(id: number, status: string): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}/societies/${id}/status`, { status });
    }

    // Subdomains
    getSubdomains(): Observable<SubdomainInfo[]> {
        return this.http.get<SubdomainInfo[]>(`${this.apiUrl}/subdomains`);
    }

    // Monitoring
    getMonitoringSummary(): Observable<MonitoringSummary> {
        return this.http.get<MonitoringSummary>(`${this.apiUrl}/monitoring/summary`);
    }
}
