import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Payment } from '../models/payment.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    constructor(private http: HttpClient, private authService: AuthService) {}

    getPayments(): Observable<Payment[]> {
        const user = this.authService.currentUserValue;
        const societyId = user?.societyId || 1;
        const isAdmin = user?.roles?.includes('SOCIETY_ADMIN') || user?.roles?.includes('PLATFORM_ADMIN') || user?.globalRole === 'PLATFORM_ADMIN';
        
        const payload = { societyId: societyId, page: 0, size: 100, sortBy: 'createdAt', sortDirection: 'DESC' };
        
        const endpoint = isAdmin ? '/admin/payments/history' : '/user/payments/history';
        
        return this.http.post<any>(`${environment.apiBaseUrl}${endpoint}`, payload).pipe(
            map(response => {
                if (response && response.content) {
                    return response.content.map((dto: any) => this.mapDtoToPayment(dto));
                }
                return [];
            })
        );
    }

    getPaymentById(id: number): Observable<Payment | undefined> {
        const user = this.authService.currentUserValue;
        const societyId = user?.societyId || 1;
        const isAdmin = user?.roles?.includes('SOCIETY_ADMIN') || user?.roles?.includes('PLATFORM_ADMIN') || user?.globalRole === 'PLATFORM_ADMIN';
        
        const payload = { paymentId: id, societyId: societyId };
        
        const endpoint = isAdmin ? '/admin/payments/details' : '/user/payments/details';
        
        return this.http.post<any>(`${environment.apiBaseUrl}${endpoint}`, payload).pipe(
            map(dto => this.mapDtoToPayment(dto))
        );
    }

    private mapDtoToPayment(dto: any): Payment {
        return {
            id: dto.id,
            transactionId: dto.transactionRef || 'N/A',
            invoiceId: dto.billNumber || 'N/A',
            residentName: dto.residentName || 'N/A',
            unitNumber: dto.unitNumber || 'N/A',
            amount: dto.amount || 0,
            paymentDate: dto.paidAt || dto.createdAt,
            paymentMethod: dto.paymentMode || 'N/A',
            status: dto.paymentStatus === 'SUCCESS' ? 'COMPLETED' : 
                    dto.paymentStatus === 'FAILED' ? 'FAILED' : 'PENDING',
            receiptUrl: dto.paymentStatus === 'SUCCESS' ? '#' : undefined
        } as Payment;
    }
}
