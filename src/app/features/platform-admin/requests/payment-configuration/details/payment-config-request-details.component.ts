import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { PlatformPaymentConfigService } from '../platform-payment-config.service';

@Component({
  selector: 'app-payment-config-request-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-config-request-details.component.html'
})
export class PaymentConfigRequestDetailsComponent implements OnInit {
  requestDetails: any = null;
  loading: boolean = true;
  error: string | null = null;
  
  // Action Modal State
  showActionModal: boolean = false;
  actionType: 'approve' | 'reject' | null = null;
  remarks: string = '';
  isSubmitting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private service: PlatformPaymentConfigService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDetails(id);
    } else {
      this.error = "Invalid Request ID";
      this.loading = false;
    }
  }

  loadDetails(id: string) {
    this.http.get(`${environment.apiBaseUrl}/platform/payment-configurations/${id}`).subscribe({
      next: (data) => {
        this.requestDetails = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.error = "Failed to load request details.";
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openActionModal(type: 'approve' | 'reject') {
    this.actionType = type;
    this.remarks = type === 'approve' ? 'Approved after verification' : '';
    this.showActionModal = true;
  }

  closeActionModal() {
    this.showActionModal = false;
    this.actionType = null;
    this.remarks = '';
  }

  confirmAction() {
    if (this.actionType === 'reject' && !this.remarks.trim()) {
      return; // Validation: require remarks for rejection
    }

    this.isSubmitting = true;

    if (this.actionType === 'approve') {
      this.service.approveRequest(this.requestDetails.id, this.remarks).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.closeActionModal();
          this.router.navigate(['/platform/requests/payment-configuration']);
        },
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
        }
      });
    } else if (this.actionType === 'reject') {
      this.service.rejectRequest(this.requestDetails.id, this.remarks).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.closeActionModal();
          this.router.navigate(['/platform/requests/payment-configuration']);
        },
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/platform/requests/payment-configuration']);
  }

  formatUrl(url: string): string {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return 'https://' + url;
  }
}
