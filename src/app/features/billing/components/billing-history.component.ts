import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BillingService } from '../services/billing.service';
import { BillingRecord } from '../models/billing.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-billing-history',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="billing-list-container">
      <div class="page-header">
        <div class="header-content">
          <h1>Generated Bills</h1>
          <p>View and manage all automatically generated invoices</p>
        </div>
      </div>

      <div class="controls-card">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (ngModelChange)="onSearchChange($event)"
            placeholder="Search by invoice number..."
          >
        </div>
        <div class="filters">
          <select [(ngModel)]="statusFilter" (change)="loadBills()">
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PARTIAL">Partial</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
      </div>

      <div class="data-table-card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Bill Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let bill of bills">
                <td><span class="invoice-number">{{ bill.invoiceNumber }}</span></td>
                <td>{{ bill.billDate | date }}</td>
                <td>{{ bill.dueDate | date }}</td>
                <td><span class="amount">₹{{ bill.totalAmount }}</span></td>
                <td>
                  <span class="status-badge" [ngClass]="bill.status.toLowerCase()">
                    {{ bill.status }}
                  </span>
                </td>
                <td class="actions">
                  <button class="btn-icon" title="View Details" [routerLink]="['/billing/details', bill.id]">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button *ngIf="bill.status !== 'PAID'" class="btn-icon success" title="Mark as Paid" (click)="markPaid(bill)">
                    <i class="fas fa-check"></i>
                  </button>
                </td>
              </tr>
              <tr *ngIf="bills.length === 0 && !loading">
                <td colspan="6" class="empty-state">
                  <i class="fas fa-file-invoice"></i>
                  <p>No bills found</p>
                </td>
              </tr>
              <tr *ngIf="loading">
                <td colspan="6" class="loading-state">
                  <div class="spinner"></div>
                  <p>Loading bills...</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="pagination" *ngIf="totalPages > 1">
          <button [disabled]="currentPage === 0" (click)="changePage(currentPage - 1)">
            <i class="fas fa-chevron-left"></i>
          </button>
          <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
          <button [disabled]="currentPage >= totalPages - 1" (click)="changePage(currentPage + 1)">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .billing-list-container { padding: 24px; animation: fadeIn 0.4s ease-out; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 28px; font-weight: 700; color: #1e293b; margin: 0 0 8px 0; }
    .page-header p { color: #64748b; margin: 0; }
    .controls-card { background: white; padding: 20px; border-radius: 16px; margin-bottom: 24px; display: flex; gap: 16px; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .search-box { flex: 1; position: relative; }
    .search-box i { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
    .search-box input { width: 100%; padding: 12px 16px 12px 48px; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 15px; transition: all 0.3s ease; box-sizing: border-box; }
    .search-box input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
    .filters select { padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 15px; background: white; min-width: 150px; outline: none; }
    .data-table-card { background: white; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }
    .table-responsive { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { background: #f8fafc; padding: 16px 24px; text-align: left; font-weight: 600; color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; }
    .data-table td { padding: 16px 24px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 15px; vertical-align: middle; }
    .invoice-number { font-family: monospace; background: #f1f5f9; padding: 4px 8px; border-radius: 6px; color: #475569; font-weight: 600; }
    .amount { font-weight: 600; color: #0f172a; }
    .status-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .status-badge.pending { background: #fefce8; color: #ca8a04; }
    .status-badge.paid { background: #f0fdf4; color: #16a34a; }
    .status-badge.partial { background: #eff6ff; color: #2563eb; }
    .status-badge.overdue { background: #fef2f2; color: #dc2626; }
    .actions { display: flex; gap: 8px; }
    .btn-icon { width: 36px; height: 36px; border-radius: 8px; border: none; background: #f1f5f9; color: #64748b; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; }
    .btn-icon:hover { background: #e2e8f0; color: #3b82f6; }
    .btn-icon.success:hover { color: #16a34a; }
    .empty-state, .loading-state { text-align: center; padding: 64px 24px !important; color: #94a3b8 !important; }
    .empty-state i { font-size: 48px; margin-bottom: 16px; color: #cbd5e1; }
    .spinner { width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px auto; }
    .pagination { display: flex; align-items: center; justify-content: center; gap: 16px; padding: 16px; border-top: 1px solid #e2e8f0; }
    .pagination button { border: 1px solid #e2e8f0; background: white; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #475569; }
    .pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `]
})
export class BillingHistoryComponent implements OnInit {
  bills: BillingRecord[] = [];
  loading = false;
  
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  
  searchQuery = '';
  statusFilter = '';
  
  private searchSubject = new Subject<string>();

  constructor(private billingService: BillingService, private cdr: ChangeDetectorRef) {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadBills();
    });
  }

  ngOnInit(): void {
    this.loadBills();
  }

  loadBills(): void {
    this.loading = true;
    const request = {
      page: this.currentPage,
      size: this.pageSize,
      invoiceNumber: this.searchQuery,
      status: this.statusFilter
    };

    this.billingService.getBillingHistory(request).subscribe({
      next: (res) => {
        this.bills = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadBills();
    }
  }

  markPaid(bill: BillingRecord): void {
    if(confirm('Are you sure you want to mark this bill as Paid?')) {
      this.billingService.markPaid(bill.id).subscribe(() => {
        this.loadBills();
      });
    }
  }
}
