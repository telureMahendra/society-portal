import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Visitor, VisitorPurpose, VisitorStatus } from '../../core/models/visitor.model';
import { VisitorService } from '../../core/services/visitor.service';

@Component({
    selector: 'app-visitor-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="visitors-container animate-up">
      <header class="page-header">
        <div class="title-section">
          <h1>Visitor <span>Log</span></h1>
          <p>Real-time tracking of entries, exits, and purpose of visits</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline"><i class="fas fa-print"></i> Print Log</button>
          <button class="btn btn-primary" (click)="openRegisterModal()"><i class="fas fa-user-check"></i> Register Entry</button>
        </div>
      </header>

      <!-- Stats Cards -->
      <div class="stats-cards">
        <div class="stat-card glass-card">
          <div class="icon-bg in"><i class="fas fa-sign-in-alt"></i></div>
          <div class="stat-info">
            <span class="label">Currently Inside</span>
            <span class="value">{{ checkedInCount }}</span>
          </div>
        </div>
        <div class="stat-card glass-card">
          <div class="icon-bg delivery"><i class="fas fa-shipping-fast"></i></div>
          <div class="stat-info">
            <span class="label">Deliveries Today</span>
            <span class="value">{{ deliveryCount }}</span>
          </div>
        </div>
        <div class="stat-card glass-card">
          <div class="icon-bg warning"><i class="fas fa-clock"></i></div>
          <div class="stat-info">
            <span class="label">Overstay Risk</span>
            <span class="value">{{ overstayCount }}</span>
          </div>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="filters-bar glass-card">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" [(ngModel)]="searchTerm" placeholder="Search by name, mobile, or flat...">
        </div>
        
        <div class="filter-group">
          <select [(ngModel)]="selectedPurpose" class="filter-select">
            <option value="ALL">All Purposes</option>
            <option value="DELIVERY">Delivery</option>
            <option value="GUEST">Guest</option>
            <option value="SERVICE">Service</option>
          </select>

          <select [(ngModel)]="selectedStatus" class="filter-select">
            <option value="ALL">All Statuses</option>
            <option value="CHECKED_IN">Inside</option>
            <option value="CHECKED_OUT">Exited</option>
          </select>
        </div>
      </div>

      <!-- Visitor Logs -->
      <div class="logs-container glass-card">
        <div class="table-responsive">
          <table class="visitors-table">
            <thead>
              <tr>
                <th>Visitor</th>
                <th>Purpose</th>
                <th>Destination</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let visitor of filteredVisitors" class="visitor-row">
                <td>
                  <div class="visitor-info">
                    <div class="avatar-small">
                      <i class="fas fa-user"></i>
                    </div>
                    <div class="details">
                      <span class="name">{{ visitor.firstName }} {{ visitor.lastName }}</span>
                      <span class="mobile">{{ visitor.mobile }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="purpose-badge" [class]="visitor.purpose.toLowerCase()">
                    <i [class]="getPurposeIcon(visitor.purpose)"></i>
                    {{ visitor.purpose }}
                  </span>
                </td>
                <td>
                  <div class="target-unit">
                    <strong>{{ visitor.unitMapping.wing }}</strong>
                    <span>Flat {{ visitor.unitMapping.flatNumber }}</span>
                  </div>
                </td>
                <td>
                  <div class="time-info">
                    <span class="time">{{ visitor.checkInTime | date:'shortTime' }}</span>
                    <span class="date">{{ visitor.checkInTime | date:'mediumDate' }}</span>
                  </div>
                </td>
                <td>
                  <div class="time-info" *ngIf="visitor.checkOutTime">
                    <span class="time">{{ visitor.checkOutTime | date:'shortTime' }}</span>
                    <span class="date">{{ visitor.checkOutTime | date:'mediumDate' }}</span>
                  </div>
                  <span class="not-available" *ngIf="!visitor.checkOutTime">-</span>
                </td>
                <td>
                  <span class="status-badge" [class]="getStatusClass(visitor)">
                    {{ visitor.status.replace('_', ' ') }}
                  </span>
                </td>
                <td>
                  <div class="actions">
                    <button 
                      *ngIf="visitor.status === 'CHECKED_IN' || visitor.status === 'OVERSTAYED'"
                      class="btn btn-sm btn-outline success" 
                      (click)="checkout(visitor.id)">
                      <i class="fas fa-sign-out-alt"></i> Checkout
                    </button>
                    <button class="btn-icon" title="View Details"><i class="fas fa-eye"></i></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="filteredVisitors.length === 0" class="empty-state">
          <i class="fas fa-clipboard-list"></i>
          <h3>No entries found</h3>
          <p>The visitor log is currently empty for the selected filters.</p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .visitors-container { max-width: 1400px; margin: 0 auto; }

    .page-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
      h1 { font-size: 2.25rem; font-weight: 800; margin: 0; letter-spacing: -0.02em; span { color: #2563eb; } }
      p { color: #64748b; margin: 0.5rem 0 0 0; }
      .header-actions { display: flex; gap: 1rem; }
    }

    .stats-cards {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2rem;
      .stat-card {
        display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem !important;
        .icon-bg {
          width: 56px; height: 56px; border-radius: 1rem; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
          &.in { background: #dcfce7; color: #15803d; }
          &.delivery { background: #eff6ff; color: #1e40af; }
          &.warning { background: #fee2e2; color: #b91c1c; }
        }
        .stat-info {
          .label { display: block; font-size: 0.875rem; color: #64748b; font-weight: 600; margin-bottom: 0.25rem; }
          .value { font-size: 1.75rem; font-weight: 800; color: #1e293b; }
        }
      }
    }

    .filters-bar {
      display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 2rem !important; margin-bottom: 2rem; gap: 2rem;
      .search-box {
        flex: 1; position: relative;
        i { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        input { width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; outline: none; &:focus { border-color: #2563eb; } }
      }
      .filter-group { display: flex; gap: 1rem; }
      .filter-select { padding: 0.75rem 1.5rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; outline: none; background: white; font-weight: 500; }
    }

    .logs-container { padding: 0 !important; overflow: hidden; }

    .visitors-table {
      width: 100%; border-collapse: collapse; text-align: left;
      th { padding: 1.25rem 2rem; background: #f8fafc; color: #64748b; font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
      td { padding: 1.25rem 2rem; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
    }

    .visitor-row:hover { background: #f8fafc; }

    .visitor-info {
      display: flex; align-items: center; gap: 1rem;
      .avatar-small { width: 40px; height: 40px; border-radius: 50%; background: #f1f5f9; color: #94a3b8; display: flex; align-items: center; justify-content: center; }
      .details { display: flex; flex-direction: column; .name { font-weight: 700; color: #1e293b; } .mobile { font-size: 0.75rem; color: #94a3b8; } }
    }

    .purpose-badge {
      display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.375rem 0.75rem; border-radius: 0.5rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
      &.delivery { background: #eff6ff; color: #1e40af; }
      &.guest { background: #f0fdf4; color: #15803d; }
      &.service { background: #fffbeb; color: #b45309; }
    }

    .target-unit {
      display: flex; flex-direction: column; strong { color: #1e293b; } span { font-size: 0.75rem; color: #64748b; }
    }

    .time-info {
      display: flex; flex-direction: column; .time { font-weight: 700; color: #1e293b; } .date { font-size: 0.75rem; color: #94a3b8; }
    }

    .status-badge {
      padding: 0.375rem 0.75rem; border-radius: 2rem; font-size: 0.75rem; font-weight: 800; white-space: nowrap;
      &.checked-in { background: #dcfce7; color: #15803d; }
      &.checked-out { background: #f1f5f9; color: #64748b; }
      &.overstayed { background: #fee2e2; color: #b91c1c; animation: pulse 2s infinite; }
    }

    .actions {
      display: flex; align-items: center; gap: 0.75rem;
      .btn-sm { padding: 0.5rem 1rem; font-size: 0.8125rem; }
      .btn-outline.success:hover { background: #10b981; border-color: #10b981; color: white; }
      .btn-icon { width: 32px; height: 32px; border-radius: 0.5rem; border: 1px solid #e2e8f0; background: white; color: #64748b; cursor: pointer; transition: all 0.2s; &:hover { color: #2563eb; border-color: #2563eb; } }
    }

    .empty-state { text-align: center; padding: 4rem 2rem; i { font-size: 3rem; color: #e2e8f0; margin-bottom: 1.5rem; } h3 { color: #1e293b; margin: 0 0 0.5rem 0; } p { color: #64748b; margin: 0; } }

    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }

    .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border-radius: 1rem; border: 1px solid rgba(255,255,255,0.5); box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .btn { padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem;
      &.btn-primary { background: #2563eb; color: white; &:hover { background: #1d4ed8; } }
      &.btn-outline { background: white; border: 1px solid #e2e8f0; color: #1e293b; &:hover { background: #f8fafc; } }
    }
    .animate-up { animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class VisitorListComponent implements OnInit {
    visitors: Visitor[] = [];
    searchTerm: string = '';
    selectedPurpose: string = 'ALL';
    selectedStatus: string = 'ALL';

    constructor(private visitorService: VisitorService) { }

    ngOnInit(): void {
        this.visitorService.getVisitors().subscribe(data => this.visitors = data);
    }

    get filteredVisitors(): Visitor[] {
        return this.visitors.filter(v => {
            const search = this.searchTerm.toLowerCase();
            const matchSearch = `${v.firstName} ${v.lastName}`.toLowerCase().includes(search) ||
                v.mobile.includes(search) ||
                v.unitMapping.flatNumber.includes(search);

            const matchPurpose = this.selectedPurpose === 'ALL' || v.purpose === this.selectedPurpose;
            const matchStatus = this.selectedStatus === 'ALL' || v.status === this.selectedStatus;

            return matchSearch && matchPurpose && matchStatus;
        });
    }

    get checkedInCount(): number {
        return this.visitors.filter(v => v.status === 'CHECKED_IN' || v.status === 'OVERSTAYED').length;
    }

    get deliveryCount(): number {
        return this.visitors.filter(v => v.purpose === 'DELIVERY').length;
    }

    get overstayCount(): number {
        return this.visitors.filter(v => v.status === 'OVERSTAYED').length;
    }

    getPurposeIcon(purpose: VisitorPurpose): string {
        switch (purpose) {
            case 'DELIVERY': return 'fas fa-shipping-fast';
            case 'GUEST': return 'fas fa-user-friends';
            case 'SERVICE': return 'fas fa-tools';
            case 'REPAIR': return 'fas fa-wrench';
            default: return 'fas fa-walking';
        }
    }

    getStatusClass(visitor: Visitor): string {
        return visitor.status.toLowerCase().replace('_', '-');
    }

    checkout(id: number): void {
        this.visitorService.checkoutVisitor(id).subscribe(success => {
            if (success) {
                this.visitorService.getVisitors().subscribe(data => this.visitors = data);
            }
        });
    }

    openRegisterModal(): void {
        alert('Visitor entry modal will be implemented in the next step.');
    }
}
