import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BillingService } from '../services/billing.service';

@Component({
  selector: 'app-billing-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="billing-dashboard-container">
      <div class="page-header">
        <div class="header-content">
          <h1>Billing Dashboard</h1>
          <p>Overview of society billing, collections, and outstanding dues</p>
        </div>
      </div>

      <div class="metrics-grid">
        <div class="metric-card total">
          <div class="metric-icon">
            <i class="fas fa-file-invoice-dollar"></i>
          </div>
          <div class="metric-info">
            <span class="label">Total Bills Generated</span>
            <span class="value" *ngIf="!isLoading">₹ {{ summary.totalBilled | number }}</span>
            <span class="value skeleton-val" *ngIf="isLoading">—</span>
          </div>
        </div>

        <div class="metric-card paid">
          <div class="metric-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="metric-info">
            <span class="label">Paid</span>
            <span class="value" *ngIf="!isLoading">₹ {{ summary.totalPaid | number }}</span>
            <span class="value skeleton-val" *ngIf="isLoading">—</span>
          </div>
        </div>

        <div class="metric-card pending">
          <div class="metric-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="metric-info">
            <span class="label">Pending</span>
            <span class="value" *ngIf="!isLoading">₹ {{ summary.totalPending | number }}</span>
            <span class="value skeleton-val" *ngIf="isLoading">—</span>
          </div>
        </div>

        <div class="metric-card overdue">
          <div class="metric-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="metric-info">
            <span class="label">Overdue</span>
            <span class="value" *ngIf="!isLoading">₹ {{ summary.totalOverdue | number }}</span>
            <span class="value skeleton-val" *ngIf="isLoading">—</span>
          </div>
        </div>

        <div class="metric-card addon">
          <div class="metric-icon">
            <i class="fas fa-plus-circle"></i>
          </div>
          <div class="metric-info">
            <span class="label">Add-On Bills</span>
            <span class="value" *ngIf="!isLoading">₹ {{ summary.totalAddon | number }}</span>
            <span class="value skeleton-val" *ngIf="isLoading">—</span>
          </div>
        </div>
      </div>

      <div class="actions-grid">
        <a routerLink="configuration" class="action-card">
          <i class="fas fa-cogs"></i>
          <h3>Billing Configuration</h3>
          <p>Setup monthly recurring charges</p>
        </a>
        <a routerLink="history" class="action-card">
          <i class="fas fa-history"></i>
          <h3>Generated Bills</h3>
          <p>View and manage all generated invoices</p>
        </a>
        <a routerLink="addon" class="action-card">
          <i class="fas fa-plus"></i>
          <h3>Add-On Bills</h3>
          <p>Create and track one-time charges</p>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .billing-dashboard-container { padding: 24px; animation: fadeIn 0.4s ease-out; }
    .page-header { margin-bottom: 32px; }
    .page-header h1 { font-size: 28px; font-weight: 700; color: #1e293b; margin: 0 0 8px 0; }
    .page-header p { color: #64748b; margin: 0; font-size: 16px; }
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 40px; }
    .metric-card { background: white; border-radius: 16px; padding: 24px; display: flex; align-items: center; gap: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .metric-card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
    .metric-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
    .metric-info { display: flex; flex-direction: column; }
    .metric-info .label { color: #64748b; font-size: 14px; font-weight: 500; margin-bottom: 4px; }
    .metric-info .value { color: #0f172a; font-size: 24px; font-weight: 700; }
    .metric-card.total .metric-icon { background: #eff6ff; color: #3b82f6; }
    .metric-card.paid .metric-icon { background: #f0fdf4; color: #22c55e; }
    .metric-card.pending .metric-icon { background: #fefce8; color: #eab308; }
    .metric-card.overdue .metric-icon { background: #fef2f2; color: #ef4444; }
    .metric-card.addon .metric-icon { background: #f5f3ff; color: #8b5cf6; }
    .actions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
    .action-card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px 24px; text-align: center; text-decoration: none; color: inherit; transition: all 0.3s ease; display: flex; flex-direction: column; align-items: center; gap: 16px; }
    .action-card:hover { border-color: #3b82f6; box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.1); transform: translateY(-4px); }
    .action-card i { font-size: 40px; color: #3b82f6; }
    .action-card h3 { margin: 0; font-size: 20px; font-weight: 600; color: #1e293b; }
    .action-card p { margin: 0; color: #64748b; font-size: 15px; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .skeleton-val { color: #cbd5e1; }
  `]
})
export class BillingDashboardComponent implements OnInit {
  isLoading = true;
  summary = { totalBilled: 0, totalPaid: 0, totalPending: 0, totalOverdue: 0, totalAddon: 0 };

  constructor(private billingService: BillingService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.billingService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
