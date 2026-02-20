import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlatformAdminService, Federation } from '../../services/platform-admin.service';
import { ApiError } from '../../../../core/interceptors/api-error.interceptor';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-federation-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Federation Management</h1>
        <button class="btn btn-primary" (click)="openModal()">
          <i class="fas fa-plus"></i> New Federation
        </button>
      </div>

      <div class="flash success" *ngIf="successMessage">{{ successMessage }}</div>
      <div class="flash error" *ngIf="errorMessage">{{ errorMessage }}</div>

      <!-- Filters -->
      <div class="filters-bar">
        <input type="text" placeholder="Search by name..." class="form-control" (input)="onSearch($event)">
        <select class="form-control" (change)="onStatusFilter($event)">
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      <!-- Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Subdomain</th>
              <th>Status</th>
              <th>Societies</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="loading">
              <td colspan="7" class="text-center p-4">
                <i class="fas fa-spinner fa-spin"></i> Loading federations...
              </td>
            </tr>
            <ng-container *ngIf="!loading">
              <tr *ngFor="let fed of federations">
              <td>{{ fed.name }}</td>
              <td>{{ fed.code }}</td>
              <td>
                 <span class="badge subdomain">{{ fed.subdomain }}</span>
              </td>
              <td>
                <span class="badge status" [class]="fed.status.toLowerCase()">{{ fed.status }}</span>
              </td>
              <td>{{ fed.societiesCount }}</td>
              <td>{{ fed.createdAt | date:'mediumDate' }}</td>
              <td class="actions">
                <button class="btn-icon" (click)="editFederation(fed)" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" (click)="toggleStatus(fed)" [title]="fed.status === 'ACTIVE' ? 'Deactivate' : 'Activate'">
                  <i class="fas" [class.fa-ban]="fed.status === 'ACTIVE'" [class.fa-check]="fed.status !== 'ACTIVE'"></i>
                </button>
              </td>
            </tr>
            </ng-container>
            <tr *ngIf="federations.length === 0 && !loading">
              <td colspan="7" class="empty-state">No federations found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Simple Modal for Create/Edit -->
      <div class="modal-backdrop" *ngIf="showModal">
        <div class="modal-dialog">
          <div class="modal-header">
            <h2>{{ isEditing ? 'Edit Federation' : 'Create Federation' }}</h2>
            <button class="close-btn" (click)="closeModal()">&times;</button>
          </div>
          <div class="modal-body">
            <form [formGroup]="federationForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label>Name</label>
                <input type="text" formControlName="name" class="form-control" [class.error]="f['name'].invalid && f['name'].touched">
                <div class="error-msg" *ngIf="f['name'].hasError('required') && f['name'].touched">Name is required</div>
              </div>

              <div class="form-group">
                <label>Code</label>
                <input type="text" formControlName="code" class="form-control" [class.error]="f['code'].invalid && f['code'].touched">
                 <div class="error-msg" *ngIf="f['code'].hasError('required') && f['code'].touched">Code is required</div>
              </div>

              <div class="form-group">
                <label>Subdomain</label>
                <input type="text" formControlName="subdomain" class="form-control" [class.error]="f['subdomain'].invalid && f['subdomain'].touched">
                 <div class="error-msg" *ngIf="f['subdomain'].hasError('required') && f['subdomain'].touched">Subdomain is required</div>
              </div>

              <div class="modal-actions">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="federationForm.invalid || loading">
                  {{ loading ? 'Saving...' : 'Save' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding-bottom: 2rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin: 0; }
    .flash { border-radius: 0.5rem; padding: 0.75rem 1rem; margin-bottom: 1rem; font-size: 0.92rem; }
    .flash.success { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
    .flash.error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    
    .filters-bar { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
    .form-control { padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 0.375rem; }
    
    .table-container { background: white; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 1rem; text-align: left; border-bottom: 1px solid #f1f5f9; }
    .data-table th { background: #f8fafc; font-weight: 600; color: #475569; font-size: 0.875rem; }
    .data-table tr:hover { background: #f8fafc; }
    
    .badge { padding: 0.25rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
    .badge.subdomain { background: #f1f5f9; color: #64748b; font-family: monospace; }
    .badge.status.active { background: #dcfce7; color: #16a34a; }
    .badge.status.inactive { background: #fee2e2; color: #dc2626; }
    .badge.status.pending { background: #fef9c3; color: #ca8a04; }

    .btn { padding: 0.5rem 1rem; border-radius: 0.375rem; border: none; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .btn-primary { background: #3b82f6; color: white; &:hover { background: #2563eb; } }
    .btn-secondary { background: #e2e8f0; color: #475569; &:hover { background: #cbd5e1; } }
    .btn-icon { background: none; border: none; color: #64748b; cursor: pointer; padding: 0.5rem; &:hover { color: #3b82f6; } }

    /* Modal Styles */
    .modal-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-dialog { background: white; border-radius: 0.75rem; width: 100%; max-width: 500px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); overflow: hidden; }
    .modal-header { padding: 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; h2 { margin: 0; font-size: 1.25rem; } }
    .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b; }
    .modal-body { padding: 1.5rem; }
    .form-group { margin-bottom: 1rem; label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #334155; } input { width: 100%; box-sizing: border-box; } }
    .modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; }
    .error { border-color: #ef4444; }
    .error-msg { color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem; }
    .empty-state { text-align: center; padding: 3rem; color: #94a3b8; }
  `]
})
export class FederationManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private platformService = inject(PlatformAdminService);

  federations: Federation[] = [];
  federationForm: FormGroup;
  showModal = false;
  isEditing = false;
  loading = true;
  currentId: number | null = null;
  errorMessage = '';
  successMessage = '';
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.federationForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      subdomain: ['', Validators.required]
    });
  }

  get f() { return this.federationForm.controls; }

  ngOnInit() {
    this.loadFederations();
  }

  loadFederations() {
    this.platformService.getFederations().subscribe({
      next: (data) => {
        // Assuming API returns { content: [...], ... } or just array for now
        this.federations = Array.isArray(data) ? data : (data.content || []);
        this.errorMessage = '';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: ApiError) => {
        this.errorMessage = `Failed to load federations: ${error.message}`;
        this.federations = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openModal() {
    this.isEditing = false;
    this.currentId = null;
    this.federationForm.reset();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  editFederation(fed: Federation) {
    this.isEditing = true;
    this.currentId = fed.id;
    this.federationForm.patchValue({
      name: fed.name,
      code: fed.code,
      subdomain: fed.subdomain
    });
    this.showModal = true;
  }

  onSubmit() {
    if (this.federationForm.invalid) return;

    this.loading = true;
    const data = this.federationForm.value;

    if (this.isEditing && this.currentId) {
      this.platformService.updateFederation(this.currentId, data).subscribe({
        next: () => {
          this.loadFederations();
          this.closeModal();
          this.loading = false;
          this.successMessage = 'Federation updated successfully.';
        },
        error: (error: ApiError) => {
          this.loading = false;
          this.errorMessage = `Update failed: ${error.message}`;
        }
      });
    } else {
      this.platformService.createFederation(data).subscribe({
        next: () => {
          this.loadFederations();
          this.closeModal();
          this.loading = false;
          this.successMessage = 'Federation created successfully.';
        },
        error: (error: ApiError) => {
          this.loading = false;
          this.errorMessage = `Creation failed: ${error.message}`;
        }
      });
    }
  }

  toggleStatus(fed: Federation) {
    const newStatus = fed.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    if (confirm(`Are you sure you want to change status to ${newStatus}?`)) {
      this.platformService.updateFederationStatus(fed.id, newStatus).subscribe({
        next: () => {
          this.loadFederations();
          this.successMessage = `Federation status updated to ${newStatus}.`;
        },
        error: (error: ApiError) => {
          this.errorMessage = `Status update failed: ${error.message}`;
        }
      });
    }
  }

  onSearch(event: any) {
    // Implement search logic or API call
  }

  onStatusFilter(event: any) {
    const status = event.target.value;
    this.platformService.getFederations(0, 10, status).subscribe({
      next: data => {
        this.federations = Array.isArray(data) ? data : (data.content || []);
      },
      error: (error: ApiError) => {
        this.errorMessage = `Filter request failed: ${error.message}`;
      }
    });
  }
}
