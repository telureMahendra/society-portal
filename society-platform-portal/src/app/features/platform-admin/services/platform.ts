import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface PlatformSummary {
  totalFederations: number;
  totalSocieties: number;
  totalActiveUsers: number;
  totalActiveFlats: number;
  platformHealthStatus: string;
}

export interface Federation {
  id: number;
  name: string;
  code: string;
  subdomain: string;
  status: string;
  createdAt: string;
  societiesCount: number;
}

export interface Society {
  id: number;
  name: string;
  federationName: string;
  subdomain: string;
  city: string;
  totalFlats: number;
  status: string;
}

export interface Subdomain {
  subdomain: string;
  type: 'FEDERATION' | 'SOCIETY';
  linkedEntityName: string;
  status: string;
  createdAt: string;
}

export interface PlatformMonitoringStats {
  activeTenants: number;
  apiHealth: string;
  recentOnboardings: number;
  systemAlerts: any[];
}

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  private apiUrl = `${environment.apiBaseUrl}/platform`;

  constructor(private http: HttpClient) { }

  getDashboardSummary(): Observable<PlatformSummary> {
    return this.http.get<PlatformSummary>(`${this.apiUrl}/dashboard/summary`);
  }

  // Federations
  getFederations(page: number = 0, size: number = 10, status?: string): Observable<any> {
    let url = `${this.apiUrl}/federations?page=${page}&size=${size}`;
    if (status && status !== 'ALL') {
      url += `&status=${status}`;
    }
    return this.http.get<any>(url);
  }

  createFederation(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/federations`, data);
  }

  // Societies
  getSocieties(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/societies?page=${page}&size=${size}`);
  }

  updateSocietyStatus(id: number, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/societies/${id}/status`, { status });
  }

  // Subdomains
  getSubdomains(): Observable<Subdomain[]> {
    return this.http.get<Subdomain[]>(`${this.apiUrl}/subdomains`);
  }

  // Monitoring
  getMonitoringSummary(): Observable<PlatformMonitoringStats> {
    return this.http.get<PlatformMonitoringStats>(`${this.apiUrl}/monitoring/summary`);
  }
}
