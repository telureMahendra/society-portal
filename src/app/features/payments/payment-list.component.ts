import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../core/services/payment.service';
import { Payment } from '../../core/models/payment.model';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="payments-container animate-up">
      <header class="page-header">
        <div class="header-content">
          <h1>Payment <span>History</span></h1>
          <p>Track all received maintenance and utility payments</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline"><i class="fas fa-download"></i> Export Excel</button>
          <button class="btn btn-primary"><i class="fas fa-print"></i> Print Report</button>
        </div>
      </header>

      <!-- Stats Bar -->
      <div class="stats-bar glass-card">
        <div class="stat-item">
          <span class="label">Total Received</span>
          <span class="value">₹ 7.5L</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="label">Transactions</span>
          <span class="value">142</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="label">Refunded</span>
          <span class="value warning">₹ 12,400</span>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="filter-section glass-card">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" [(ngModel)]="searchTerm" (input)="applyFilters()" placeholder="Search by name, unit or transaction ID...">
        </div>
        <div class="filters">
          <button 
            *ngFor="let filter of statusFilters" 
            [class.active]="currentFilter === filter"
            (click)="setFilter(filter)"
            class="filter-btn">
            {{ filter === 'all' ? 'All Transactions' : (filter | titlecase) }}
          </button>
        </div>
      </div>

      <!-- Payments Table -->
      <div class="table-container glass-card">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Resident</th>
              <th>Transaction ID</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Receipt</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let payment of filteredPayments" class="payment-row">
              <td>
                <div class="date-cell">
                  <strong>{{ payment.paymentDate | date:'mediumDate' }}</strong>
                  <span>{{ payment.paymentDate | date:'shortTime' }}</span>
                </div>
              </td>
              <td class="name-cell">
                <div class="avatar">{{ payment.residentName.charAt(0) }}</div>
                <div class="user-info">
                  <strong>{{ payment.residentName }}</strong>
                  <span>{{ payment.unitNumber }}</span>
                </div>
              </td>
              <td class="txn-cell">{{ payment.transactionId }}</td>
              <td>
                <span class="payment-method">
                  <i class="fas" [ngClass]="getMethodIcon(payment.paymentMethod)"></i>
                  {{ payment.paymentMethod }}
                </span>
              </td>
              <td class="amount-cell">₹{{ payment.amount | number }}</td>
              <td>
                <span class="status-badge" [class]="payment.status.toLowerCase()">
                  {{ payment.status }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="icon-btn" title="View Receipt" *ngIf="payment.status === 'COMPLETED'">
                  <i class="fas fa-file-invoice"></i>
                </button>
                <button class="icon-btn" title="View Details"><i class="fas fa-info-circle"></i></button>
              </td>
            </tr>
            <tr *ngIf="filteredPayments.length === 0">
              <td colspan="7" class="empty-state">
                <i class="fas fa-credit-card"></i>
                <p>No transactions found matching your criteria.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .payments-container { max-width: 1400px; margin: 0 auto; }
    
    .page-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
      h1 { font-size: 2.25rem; font-weight: 800; margin: 0; letter-spacing: -0.02em; span { color: var(--primary-color, #2563eb); } }
      p { color: #64748b; margin: 0.5rem 0 0 0; }
    }

    .header-actions { display: flex; gap: 1rem; }

    .stats-bar {
      display: flex; justify-content: space-around; align-items: center; padding: 1.5rem !important; margin-bottom: 2rem;
      .stat-item {
        text-align: center;
        .label { display: block; font-size: 0.875rem; color: #64748b; margin-bottom: 0.25rem; font-weight: 600; text-transform: uppercase; }
        .value { font-size: 1.5rem; font-weight: 800; color: #1e293b; }
        .value.warning { color: #f59e0b; }
      }
      .stat-divider { width: 1px; height: 40px; background: #e2e8f0; }
    }

    .filter-section {
      display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem !important; margin-bottom: 1.5rem; gap: 2rem;
      @media (max-width: 1024px) { flex-direction: column; align-items: stretch; }
    }

    .search-box {
      position: relative; flex: 1; max-width: 500px;
      i { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
      input {
        width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem; border: 1px solid #e2e8f0; border-radius: 0.75rem;
        font-size: 0.95rem; outline: none; transition: border-color 0.2s;
        &:focus { border-color: var(--primary-color, #2563eb); }
      }
    }

    .filters { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    
    .filter-btn {
      padding: 0.5rem 1.25rem; border-radius: 0.5rem; border: 1px solid transparent; background: #f1f5f9;
      color: #64748b; font-weight: 600; cursor: pointer; transition: all 0.2s;
      &:hover { background: #e2e8f0; }
      &.active { background: var(--primary-color, #2563eb); color: white; }
    }

    .table-container { padding: 0 !important; overflow: hidden; }

    .modern-table {
      width: 100%; border-collapse: collapse; text-align: left;
      th { padding: 1.25rem 1.5rem; background: #f8fafc; color: #64748b; font-weight: 700; font-size: 0.875rem; border-bottom: 1px solid #e2e8f0; }
      td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; }
    }

    .payment-row:hover { background: #f8fafc; }

    .date-cell {
      strong { display: block; color: #1e293b; }
      span { font-size: 0.8125rem; color: #94a3b8; }
    }

    .name-cell {
      display: flex; align-items: center; gap: 0.75rem;
      .avatar { width: 36px; height: 36px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #475569; }
      .user-info { strong { display: block; color: #1e293b; } span { font-size: 0.8125rem; color: #64748b; } }
    }

    .txn-cell { font-family: monospace; font-weight: 600; color: #64748b; }

    .payment-method {
      display: flex; align-items: center; gap: 0.5rem; color: #475569; font-weight: 500;
      i { color: #2563eb; width: 16px; }
    }

    .amount-cell { font-weight: 800; color: #1e293b; }

    .status-badge {
      display: inline-flex; padding: 0.375rem 0.75rem; border-radius: 2rem; font-size: 0.75rem; font-weight: 700;
      &.completed { background: #dcfce7; color: #166534; }
      &.pending { background: #fef9c3; color: #854d0e; }
      &.failed { background: #fee2e2; color: #991b1b; }
      &.refunded { background: #f1f5f9; color: #475569; }
    }

    .icon-btn {
      width: 32px; height: 32px; border-radius: 0.5rem; border: 1px solid #e2e8f0; background: white; color: #64748b; cursor: pointer; transition: all 0.2s;
      &:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
    }

    .empty-state { text-align: center; padding: 5rem !important; color: #94a3b8; i { font-size: 3rem; margin-bottom: 1rem; } p { font-size: 1.1rem; } }

    .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border-radius: 1rem; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid rgba(255,255,255,0.5); }
    
    .btn {
      padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; border: none; transition: all 0.2s;
      &.btn-primary { background: #2563eb; color: white; &:hover { background: #1d4ed8; } }
      &.btn-outline { background: white; border: 1px solid #e2e8f0; color: #1e293b; &:hover { background: #f8fafc; } }
    }

    .animate-up { animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class PaymentListComponent implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  searchTerm: string = '';
  currentFilter: string = 'all';
  statusFilters: string[] = ['all', 'completed', 'pending', 'failed', 'refunded'];

  constructor(private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.paymentService.getPayments().subscribe(payments => {
      this.payments = payments;
      this.applyFilters();
    });
  }

  setFilter(filter: string): void {
    this.currentFilter = filter;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredPayments = this.payments.filter(payment => {
      const searchStr = this.searchTerm.toLowerCase();
      const matchesSearch =
        payment.residentName.toLowerCase().includes(searchStr) ||
        payment.unitNumber.toLowerCase().includes(searchStr) ||
        payment.transactionId.toLowerCase().includes(searchStr) ||
        payment.invoiceId.toLowerCase().includes(searchStr);

      const matchesStatus =
        this.currentFilter === 'all' ||
        payment.status.toLowerCase() === this.currentFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }

  getMethodIcon(method: string): string {
    switch (method) {
      case 'UPI': return 'fa-mobile-alt';
      case 'CARD': return 'fa-credit-card';
      case 'NET_BANKING': return 'fa-university';
      case 'CASH': return 'fa-money-bill-wave';
      case 'CHEQUE': return 'fa-money-check';
      default: return 'fa-exchange-alt';
    }
  }
}
