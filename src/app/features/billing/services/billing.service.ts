import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BillingConfiguration, BillingRecord, AddonBill } from '../models/billing.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private configUrl = environment.apiBaseUrl + '/admin/billing/configuration';
  private billingUrl = environment.apiBaseUrl + '/admin/billing';
  private addonUrl = environment.apiBaseUrl + '/admin/billing/addon';

  constructor(private http: HttpClient) {}

  getConfigurations(request: any): Observable<any> {
    return this.http.post<any>(`${this.configUrl}/list`, request);
  }

  createConfiguration(config: any): Observable<BillingConfiguration> {
    return this.http.post<BillingConfiguration>(`${this.configUrl}/create`, config);
  }

  updateConfiguration(config: any): Observable<BillingConfiguration> {
    return this.http.post<BillingConfiguration>(`${this.configUrl}/update`, config);
  }

  deleteConfiguration(id: number): Observable<void> {
    return this.http.post<void>(`${this.configUrl}/delete`, { id });
  }

  getBillingHistory(request: any): Observable<any> {
    return this.http.post<any>(`${this.billingUrl}/history`, request);
  }

  getBillDetails(billId: number): Observable<BillingRecord> {
    return this.http.post<BillingRecord>(`${this.billingUrl}/details`, { billId });
  }

  markPaid(billId: number): Observable<void> {
    return this.http.post<void>(`${this.billingUrl}/mark-paid`, { billId });
  }

  getAddonBills(request: any): Observable<any> {
    return this.http.post<any>(`${this.addonUrl}/list`, request);
  }

  createAddonBill(bill: any): Observable<AddonBill> {
    return this.http.post<AddonBill>(`${this.addonUrl}/create`, bill);
  }

  updateAddonBill(bill: any): Observable<AddonBill> {
    return this.http.post<AddonBill>(`${this.addonUrl}/update`, bill);
  }

  getAddonBillDetails(id: number): Observable<AddonBill> {
    return this.http.post<AddonBill>(`${this.addonUrl}/details`, { id });
  }

  deleteAddonBill(id: number): Observable<void> {
    return this.http.post<void>(`${this.addonUrl}/delete`, { id });
  }

  getSummary(): Observable<{ totalBilled: number; totalPaid: number; totalPending: number; totalOverdue: number; totalAddon: number }> {
    return this.http.get<any>(`${this.billingUrl}/summary`);
  }
}
