import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillingService } from '../../core/services/billing.service';
import { Bill } from '../../core/models/bill.model';

@Component({
  selector: 'app-bill-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="billing-container animate-up">
      <header class="page-header">
        <div class="header-content">
          <h1>Maintenance <span>Bills</span></h1>
          <p>Manage and track all society maintenance invoices</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline"><i class="fas fa-download"></i> Export PDF</button>
          <button class="btn btn-primary"><i class="fas fa-plus"></i> Generate Bulk Bills</button>
        </div>
      </header>

      <!-- Stats Bar -->
      <div class="stats-bar glass-card">
        <div class="stat-item">
          <span class="label">Total Invoiced</span>
          <span class="value">₹ 1.2M</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="label">Pending</span>
          <span class="value warning">₹ 4.5L</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="label">Collected</span>
          <span class="value success">₹ 7.5L</span>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="filter-section glass-card">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" [(ngModel)]="searchTerm" (input)="applyFilters()" placeholder="Search by name or unit...">
        </div>
        <div class="filters">
          <button 
            *ngFor="let filter of statusFilters" 
            [class.active]="currentFilter === filter"
            (click)="setFilter(filter)"
            class="filter-btn">
            {{ filter | titlecase }}
          </button>
        </div>
      </div>

      <!-- Bills Table -->
      <div class="table-container glass-card">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Resident</th>
              <th>Unit</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let bill of filteredBills" class="bill-row">
              <td class="invoice-cell">#{{ bill.invoiceId }}</td>
              <td class="name-cell">
                <div class="avatar">{{ bill.residentName.charAt(0) }}</div>
                <span>{{ bill.residentName }}</span>
              </td>
              <td>{{ bill.unitNumber }}</td>
              <td class="amount-cell">
                <span class="amount">₹{{ bill.amount | number }}</span>
                <span class="penalty" *ngIf="bill.penalty">+₹{{ bill.penalty }} penalty</span>
              </td>
              <td>{{ bill.dueDate | date:'mediumDate' }}</td>
              <td>
                <span class="status-badge" [class]="bill.status.toLowerCase()">
                  {{ bill.status }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="icon-btn" title="View Details"><i class="fas fa-eye"></i></button>
                <button class="icon-btn" title="Send Reminder" *ngIf="bill.status !== 'PAID'"><i class="fas fa-bell"></i></button>
                <button class="icon-btn" title="Download PDF"><i class="fas fa-file-download"></i></button>
              </td>
            </tr>
            <tr *ngIf="filteredBills.length === 0">
              <td colspan="7" class="empty-state">
                <i class="fas fa-file-invoice"></i>
                <p>No bills found matches your criteria.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .billing-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h1 {
        font-size: 2.25rem;
        font-weight: 800;
        margin: 0;
        letter-spacing: -0.02em;

        span { color: var(--primary-color, #2563eb); }
      }

      p { color: #64748b; margin: 0.5rem 0 0 0; }
    }

    .header-actions { display: flex; gap: 1rem; }

    .stats-bar {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 1.5rem !important;
      margin-bottom: 2rem;

      .stat-item {
        text-align: center;
        .label { display: block; font-size: 0.875rem; color: #64748b; margin-bottom: 0.25rem; font-weight: 600; text-transform: uppercase; }
        .value { font-size: 1.5rem; font-weight: 800; color: #1e293b; }
        .value.warning { color: #f59e0b; }
        .value.success { color: #10b981; }
      }

      .stat-divider { width: 1px; height: 40px; background: #e2e8f0; }
    }

    .filter-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem !important;
      margin-bottom: 1.5rem;
      gap: 2rem;

      @media (max-width: 768px) { flex-direction: column; align-items: stretch; }
    }

    .search-box {
      position: relative;
      flex: 1;
      max-width: 400px;
      
      i { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
      input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 2.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.75rem;
        font-size: 0.95rem;
        outline: none;
        transition: border-color 0.2s;
        
        &:focus { border-color: var(--primary-color, #2563eb); }
      }
    }

    .filters {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 0.5rem 1.25rem;
      border-radius: 0.5rem;
      border: 1px solid transparent;
      background: #f1f5f9;
      color: #64748b;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;

      &:hover { background: #e2e8f0; }
      &.active {
        background: var(--primary-color, #2563eb);
        color: white;
      }
    }

    .table-container {
      padding: 0 !important;
      overflow: hidden;
    }

    .modern-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;

      th {
        padding: 1.25rem 1.5rem;
        background: #f8fafc;
        color: #64748b;
        font-weight: 700;
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-bottom: 1px solid #e2e8f0;
      }

      td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; }
    }

    .bill-row:hover { background: #f8fafc; }

    .invoice-cell { font-family: monospace; font-weight: 700; color: #2563eb; }

    .name-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      
      .avatar {
        width: 32px;
        height: 32px;
        background: #e2e8f0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        color: #475569;
        font-size: 0.875rem;
      }
    }

    .amount-cell {
      .amount { display: block; font-weight: 700; color: #1e293b; }
      .penalty { display: block; font-size: 0.75rem; color: #ef4444; font-weight: 600; }
    }

    .status-badge {
      display: inline-flex;
      padding: 0.375rem 0.75rem;
      border-radius: 2rem;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;

      &.paid { background: #dcfce7; color: #166534; }
      &.pending { background: #fef9c3; color: #854d0e; }
      &.overdue { background: #fee2e2; color: #991b1b; }
      &.cancelled { background: #f1f5f9; color: #475569; }
    }

    .actions-cell {
      display: flex;
      gap: 0.5rem;
    }

    .icon-btn {
      width: 32px;
      height: 32px;
      border-radius: 0.5rem;
      border: 1px solid #e2e8f0;
      background: white;
      color: #64748b;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;

      &:hover {
        border-color: #2563eb;
        color: #2563eb;
        background: #eff6ff;
      }
    }

    .empty-state {
      text-align: center;
      padding: 5rem !important;
      color: #94a3b8;
      
      i { font-size: 3rem; margin-bottom: 1rem; }
      p { font-size: 1.1rem; }
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.5);
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      border: none;
      transition: all 0.2s;

      &.btn-primary { background: #2563eb; color: white; &:hover { background: #1d4ed8; } }
      &.btn-outline { background: white; border: 1px solid #e2e8f0; color: #1e293b; &:hover { background: #f8fafc; } }
    }

    .animate-up {
      animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class BillListComponent implements OnInit {
  bills: Bill[] = [];
  filteredBills: Bill[] = [];
  searchTerm: string = '';
  currentFilter: string = 'all';
  statusFilters: string[] = ['all', 'paid', 'pending', 'overdue'];

  constructor(private billingService: BillingService) { }

  ngOnInit(): void {
    this.billingService.getBills().subscribe(bills => {
      this.bills = bills;
      this.applyFilters();
    });
  }

  setFilter(filter: string): void {
    this.currentFilter = filter;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredBills = this.bills.filter(bill => {
      const matchesSearch =
        bill.residentName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        bill.unitNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        bill.invoiceId.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        this.currentFilter === 'all' ||
        bill.status.toLowerCase() === this.currentFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }
}
