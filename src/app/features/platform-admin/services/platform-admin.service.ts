import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    code?: string;
    federationName?: string;
    subdomain?: string;
    adminNames?: string[];
    description?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    totalBuildings?: number;
    totalFlats?: number;
    amenities?: string[];
    galleryUrls?: string[];
    isTownship?: boolean;
    registrationNumber?: string;
    registrationDate?: string;
    panNumber?: string;
    gstNumber?: string;
    registrationDocUrl?: string;
    panDocUrl?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'SUSPENDED';
    createdAt?: string;
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
    totalBuildings?: number;
    totalFlats?: number;
    amenities?: string[];
    galleryUrls?: string[];
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

    // Multi-step Onboarding APIs
    createSocietyDraft(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/societies/draft`, data);
    }

    updateSocietyLegal(data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/societies/legal`, data);
    }

    uploadSocietyDocument(societyId: number, type: string, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('societyId', societyId.toString());
        formData.append('type', type);
        formData.append('file', file);
        return this.http.post<any>(`${this.apiUrl}/societies/documents`, formData);
    }

    updateSocietyBranding(societyId: number, data: any, logo?: File | null, banner?: File | null): Observable<any> {
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify({ societyId, ...data })], { type: 'application/json' }));
        if (logo) formData.append('logo', logo);
        if (banner) formData.append('banner', banner);
        return this.http.put<any>(`${this.apiUrl}/societies/branding`, formData);
    }

    assignSocietyAdminStep(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/societies/admin`, data);
    }

    submitSocietyOnboarding(data: { societyId: number, remark?: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/societies/submit`, data);
    }
    updateSocietyStatus(id: number, status: string): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}/societies/${id}/status`, { status });
    }

    getSociety(id: number): Observable<Society> {
        return this.http.get<any>(`${this.apiUrl}/societies/${id}`).pipe(
            map(data => {
                const adminNames = data.adminName ? data.adminName.split(',').map((n: string) => n.trim()) : [];
                return {
                    ...data,
                    isTownship: data.township,
                    registrationNumber: data.legalDetails?.registrationNumber,
                    registrationDate: data.legalDetails?.registrationDate,
                    panNumber: data.legalDetails?.panNumber,
                    gstNumber: data.legalDetails?.gstNumber,
                    registrationDocUrl: data.legalDetails?.registrationDocUrl,
                    panDocUrl: data.legalDetails?.panDocUrl,
                    adminNames
                } as Society;
            })
        );
    }

    getSocietyDocuments(id: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/societies/${id}/documents`);
    }

    assignSocietyAdmin(societyId: number, data: any): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/societies/${societyId}/admin`, data);
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
