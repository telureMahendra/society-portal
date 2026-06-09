import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { PlatformPaymentConfigService } from './platform-payment-config.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-config-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-config-requests.component.html'
})
export class PaymentConfigRequestsComponent implements OnInit {
  requests: any[] = [];

  constructor(
    private service: PlatformPaymentConfigService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.service.listRequests().subscribe({
      next: (data) => {
        this.requests = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to fetch requests', err)
    });
  }

  viewDetails(request: any) {
    this.router.navigate(['/platform/requests/payment-configuration', request.id]);
  }

  approve(request: any) {
    const remarks = prompt("Enter approval remarks (optional):", "Approved after verification");
    if (remarks !== null) {
      this.service.approveRequest(request.id, remarks).subscribe({
        next: () => {
          alert('Request Approved');
          this.loadRequests();
        },
        error: () => alert('Error approving request')
      });
    }
  }

  reject(request: any) {
    const remarks = prompt("Enter rejection remarks (mandatory):");
    if (remarks) {
      this.service.rejectRequest(request.id, remarks).subscribe({
        next: () => {
          alert('Request Rejected');
          this.loadRequests();
        },
        error: () => alert('Error rejecting request')
      });
    }
  }
}
