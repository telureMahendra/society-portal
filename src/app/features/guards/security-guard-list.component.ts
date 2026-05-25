import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecurityGuard } from '../../core/models/security-guard.model';
import { SecurityGuardService } from '../../core/services/security-guard.service';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { BrandingService } from '../../core/branding/branding.service';

@Component({
  selector: 'app-security-guard-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="guards-container animate-up">
      <header class="page-header">
        <div class="title-section">
          <h1>Security <span>Guards</span></h1>
          <p>Control access by managing your society's security personnel</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="showModal = true">
            <i class="fas fa-plus"></i> Add New Guard
          </button>
        </div>
      </header>

      <div class="logs-container glass-card">
        <div class="table-responsive">
          <table class="guards-table">
            <thead>
              <tr>
                <th>Guard Name</th>
                <th>Mobile Number</th>
                <th>Status</th>
                <th>Joining Date</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let guard of guards" class="guard-row">
                <td>
                  <div class="guard-info">
                    <div class="avatar-small">
                      {{ guard.name.charAt(0) }}
                    </div>
                    <div class="details">
                      <span class="name">{{ guard.name }}</span>
                      <span class="id">ID: #G-{{ guard.membershipId }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="mobile">{{ guard.mobile }}</span>
                </td>
                <td>
                  <span class="status-badge" [class.active]="guard.active">
                    {{ guard.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <span class="date">{{ "Present" }}</span>
                </td>
                <td class="text-right">
                  <div class="actions">
                    <button class="btn btn-sm btn-outline danger" (click)="deleteGuard(guard.membershipId)">
                      <i class="fas fa-trash"></i> Remove
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="guards.length === 0" class="empty-state">
          <i class="fas fa-shield-alt"></i>
          <h3>No guards registered</h3>
          <p>Start by adding your first security personnel.</p>
        </div>
      </div>

      <!-- Add Guard Modal -->
      <div class="modal-backdrop" *ngIf="showModal" (click)="showModal = false">
        <div class="modal-content glass-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
                <h2>Register Guard</h2>
                <button class="close-btn" (click)="showModal = false">&times;</button>
            </div>
            <form (ngSubmit)="addGuard()">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" [(ngModel)]="newGuard.name" name="name" placeholder="Enter full name" required>
                </div>
                <div class="form-group">
                    <label>Mobile Number</label>
                    <input type="tel" [(ngModel)]="newGuard.mobile" name="mobile" placeholder="9876543210" required>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-outline" (click)="showModal = false">Cancel</button>
                    <button type="submit" class="btn btn-primary" [disabled]="loading">
                        <span *ngIf="!loading">Add Guard</span>
                        <span *ngIf="loading">Adding...</span>
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .guards-container { max-width: 1200px; margin: 0 auto; }
    .page-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
      h1 { font-size: 2.25rem; font-weight: 800; span { color: #2563eb; } }
      p { color: #64748b; }
    }
    .glass-card { background: rgba(255, 255, 255, 0.82); backdrop-filter: blur(12px); border-radius: 1.25rem; border: 1px solid rgba(255,255,255,0.4); box-shadow: 0 8px 32px rgba(0,0,0,0.06); }
    .guards-table {
      width: 100%; border-collapse: collapse;
      th { padding: 1.25rem 2rem; background: #f8fafc; color: #64748b; font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
      td { padding: 1.25rem 2rem; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
    }
    .text-right { text-align: right; }
    .guard-info {
        display: flex; align-items: center; gap: 1rem;
        .avatar-small { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; }
        .details { display: flex; flex-direction: column; .name { font-weight: 700; } .id { font-size: 0.75rem; color: #94a3b8; } }
    }
    .status-badge {
        padding: 0.375rem 0.75rem; border-radius: 2rem; font-size: 0.75rem; font-weight: 800; background: #f1f5f9; color: #64748b;
        &.active { background: #dcfce7; color: #15803d; }
    }
    .btn {
        padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 700; cursor: pointer; border: none; transition: 0.2s;
        &.btn-primary { background: #2563eb; color: white; &:hover { background: #1d4ed8; transform: translateY(-1px); } }
        &.btn-outline { background: white; border: 1px solid #e2e8f0; &:hover { background: #f8fafc; } }
        &.danger { color: #ef4444; border-color: rgba(239, 68, 68, 0.2); &:hover { background: #ef4444; color: white; } }
        &.btn-sm { padding: 0.5rem 1rem; font-size: 0.875rem; }
    }
    .modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; }
    .modal-content { width: 100%; max-width: 480px; padding: 2.5rem; position: relative; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
    .form-group { margin-bottom: 1.5rem; label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #475569; } input { width: 100%; padding: 0.75rem 1rem; border: 1px solid #e9ecef; border-radius: 0.75rem; outline: none; &:focus { border-color: #2563eb; } } }
    .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
    .empty-state { text-align: center; padding: 4rem; i { font-size: 3rem; color: #e2e8f0; margin-bottom: 1.5rem; } }
    .animate-up { animation: fadeInUp 0.4s ease-out forwards; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class SecurityGuardListComponent implements OnInit {
  guards: SecurityGuard[] = [];
  showModal = false;
  loading = false;
  newGuard = { name: '', mobile: '' };
  currentSocietyId: number = 0;

  constructor(
    private guardService: SecurityGuardService,
    private authService: AuthService,
    private notification: NotificationService,
    private brandingService: BrandingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.brandingService.branding$.subscribe(branding => {
      if (branding) {
        this.currentSocietyId = branding.societyId;
        this.fetchGuards();
      }
    });
  }

  fetchGuards(): void {
    if (this.currentSocietyId) {
      this.guardService.getGuards(this.currentSocietyId).subscribe(data => {
        this.guards = data;
        this.cdr.detectChanges();
      });
    }
  }

  addGuard(): void {
    if (!this.currentSocietyId || !this.newGuard.name || !this.newGuard.mobile) return;

    this.loading = true;
    this.cdr.detectChanges();
    this.guardService.addGuard({ 
      societyId: this.currentSocietyId, 
      name: this.newGuard.name, 
      mobile: this.newGuard.mobile 
    }).subscribe(success => {
      this.loading = false;
      this.cdr.detectChanges();
      if (success) {
        this.showModal = false;
        this.fetchGuards();
        this.notification.success('Security guard added successfully');
        this.newGuard = { name: '', mobile: '' };
      } else {
        this.notification.error('Failed to add security guard');
      }
    });
  }

  deleteGuard(membershipId: number): void {
    if (confirm('Are you sure you want to remove this security guard?')) {
      this.guardService.deleteGuard(membershipId).subscribe(success => {
        if (success) {
            this.notification.success('Security guard removed successfully');
            this.fetchGuards();
        } else {
            this.notification.error('Failed to remove security guard');
        }
      });
    }
  }
}
