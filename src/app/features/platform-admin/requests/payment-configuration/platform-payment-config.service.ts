import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlatformPaymentConfigService {
  private apiUrl = `${environment.apiBaseUrl}/platform/payment-configurations`;

  constructor(private http: HttpClient) {}

  listRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/list`);
  }

  approveRequest(requestId: number, remarks: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/approve`, { requestId, remarks }, { responseType: 'text' });
  }

  rejectRequest(requestId: number, remarks: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reject`, { requestId, remarks }, { responseType: 'text' });
  }
}
