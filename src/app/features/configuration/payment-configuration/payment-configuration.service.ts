import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentConfigurationService {
  private apiUrl = `${environment.apiBaseUrl}/payment-configuration`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getQueryParams(): string {
    const user = this.authService.currentUserValue;
    if (user && user.societyId) {
      return `?societyId=${user.societyId}`;
    }
    return '';
  }

  getConfigDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/details${this.getQueryParams()}`);
  }

  createOrUpdateDraft(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update${this.getQueryParams()}`, payload);
  }

  submitForApproval(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit${this.getQueryParams()}`, payload, { responseType: 'text' });
  }
}
