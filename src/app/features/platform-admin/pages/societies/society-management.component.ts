import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Federation,
  PlatformAdminService,
  Society,
  SocietyOnboardingRequest
} from '../../services/platform-admin.service';
import { ApiError } from '../../../../core/interceptors/api-error.interceptor';

@Component({
  selector: 'app-society-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">EstatePilot - Society Management</h1>
          <p class="page-subtitle">Onboard societies and manage lifecycle state.</p>
        </div>
        <button class="btn btn-primary" (click)="openOnboardingModal()">
          <i class="fas fa-plus"></i>
          Onboard Society
        </button>
      </div>

      <div class="flash success" *ngIf="successMessage">{{ successMessage }}</div>
      <div class="flash error" *ngIf="listError">{{ listError }}</div>

      <div class="filters-card">
        <div class="filters-grid">
          <input
            type="text"
            class="form-control"
            placeholder="Search by name or subdomain"
            [(ngModel)]="searchTerm"
            (input)="onSearchChange()"
            name="societySearch"
          >
          <select class="form-control" [value]="statusFilter" (change)="onFilterChange('status', $event)">
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="DRAFT">Draft</option>
          </select>
          <select class="form-control" [value]="cityFilter" (change)="onFilterChange('city', $event)">
            <option value="">All Cities</option>
            <option *ngFor="let city of cities" [value]="city">{{ city }}</option>
          </select>
          <select class="form-control" [value]="federationFilter" (change)="onFilterChange('federation', $event)">
            <option value="">All Federations</option>
            <option *ngFor="let federationName of federationNames" [value]="federationName">{{ federationName }}</option>
          </select>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Federation</th>
              <th>Subdomain</th>
              <th>City</th>
              <th>Total Flats</th>
              <th>Admin</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="listLoading">
              <td colspan="8" class="table-message">Loading societies...</td>
            </tr>
            <tr *ngIf="!listLoading && filteredSocieties.length === 0">
              <td colspan="8" class="table-message">No societies found.</td>
            </tr>
            <ng-container *ngIf="!listLoading">
              <tr *ngFor="let society of filteredSocieties">
              <td class="name-col">{{ society.name }}</td>
              <td>{{ society.federationName || '-' }}</td>
              <td><span class="badge badge-subdomain">{{ society.subdomain || '-' }}</span></td>
              <td>{{ society.city || '-' }}</td>
              <td>{{ society.totalFlats ?? 0 }}</td>
              <td>
                <div *ngIf="society.adminNames && society.adminNames.length > 0" class="admin-names-list">
                  <div *ngFor="let name of society.adminNames" class="admin-name">
                    <i class="fas fa-user-tie"></i> {{ name }}
                  </div>
                </div>
                <span *ngIf="!society.adminNames || society.adminNames.length === 0" class="text-muted small">Not Assigned</span>
              </td>
              <td>
                <span class="badge badge-status" [ngClass]="getStatusClass(society.status)">
                  {{ society.status || 'UNKNOWN' }}
                </span>
              </td>
              <td>
                <div class="actions-group">
                  <ng-container *ngIf="society.status === 'DRAFT'">
                     <button class="btn btn-sm btn-outline-primary" (click)="resumeOnboarding(society)" title="Resume Onboarding">
                       Resume Onboarding
                     </button>
                  </ng-container>
                  <ng-container *ngIf="society.status !== 'DRAFT'">
                    <button class="btn-icon" (click)="viewDetails(society)" title="View Details">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" (click)="editSociety(society)" title="Edit Society">
                      <i class="fas fa-edit"></i>
                    </button>
                      <button class="btn-icon" (click)="toggleStatus(society)" [disabled]="listLoading" 
[title]="society.status === 'ACTIVE' ? 'Deactivate' : 'Activate'">
                        <i class="fas" [ngClass]="society.status === 'ACTIVE' ? 'fa-toggle-on' : 'fa-toggle-off'"></i>
                      </button>
                      <button class="btn-icon" (click)="openAdminModal(society)" title="Add Admin">
                        <i class="fas fa-user-plus"></i>
                      </button>
                    </ng-container>
                </div>
              </td>
            </tr>
            </ng-container>
          </tbody>
        </table>
      </div>
      <!-- Admin Assignment Modal -->
      <div class="modal-backdrop" *ngIf="showAdminModal" style="z-index: 1001;">
        <div class="modal-dialog small-modal">
          <div class="modal-header">
            <h2>Assign Society Admin</h2>
            <button type="button" class="close-btn" (click)="closeAdminModal()">&times;</button>
          </div>
            <form [formGroup]="adminForm" (ngSubmit)="submitAdminAssignment()" class="modal-form">
              <div class="grid">
                <div class="form-group">
                  <label>First Name *</label>
                  <input class="form-control" formControlName="firstName" type="text" placeholder="John">
                </div>
                <div class="form-group">
                  <label>Last Name *</label>
                  <input class="form-control" formControlName="lastName" type="text" placeholder="Doe">
                </div>
              </div>
              <div class="form-group">
                <label>Email *</label>
                <input class="form-control" formControlName="email" type="email" placeholder="john@example.com">
              </div>
              <div class="grid">
                <div class="form-group">
                  <label>Mobile *</label>
                  <input class="form-control" formControlName="mobile" type="text" placeholder="10 digits">
                </div>
                <div class="form-group">
                  <label>Username (Optional)</label>
                  <input class="form-control" formControlName="username" type="text" placeholder="johndoe">
                </div>
              </div>
              <div class="form-group full">
                <label>Password Assignment</label>
                <div class="d-flex" style="gap: 1rem;">
                  <div class="form-group checkbox">
                    <input type="radio" formControlName="passwordOption" id="pwdMail" value="mail">
                    <label for="pwdMail">Send via Email</label>
                  </div>
                  <div class="form-group checkbox">
                    <input type="radio" formControlName="passwordOption" id="pwdManual" value="manual">
                    <label for="pwdManual">Set Manually</label>
                  </div>
                </div>
              </div>
              <div class="form-group full" *ngIf="adminForm.get('passwordOption')?.value === 'manual'">
                <label>Initial Password *</label>
                <input class="form-control" formControlName="password" type="password" placeholder="Min 6 characters">
              </div>

            <div class="validation" *ngIf="adminError">{{ adminError }}</div>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeAdminModal()">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="adminForm.invalid || adminLoading">
                {{ adminLoading ? 'Assigning...' : 'Assign Admin' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding-bottom: 2rem; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 1rem; }
    .page-title { margin: 0; font-size: 1.6rem; font-weight: 700; color: #0f172a; }
    .page-subtitle { margin: 0.35rem 0 0; color: #64748b; font-size: 0.95rem; }

    .flash { border-radius: 0.5rem; padding: 0.75rem 1rem; margin-bottom: 1rem; font-size: 0.92rem; }
    .flash.success { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
    .flash.error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

    .filters-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1rem; margin-bottom: 1rem; }
    .filters-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.75rem; }

    .table-container { background: #fff; border: 1px solid #e2e8f0; border-radius: 0.75rem; overflow: auto; }
    .data-table { width: 100%; border-collapse: collapse; min-width: 920px; }
    .data-table th, .data-table td { padding: 0.9rem 1rem; border-bottom: 1px solid #f1f5f9; text-align: left; font-size: 0.92rem; }
    .data-table th { background: #f8fafc; color: #334155; font-weight: 600; }
    .data-table tbody tr:hover { background: #f8fafc; }
    .name-col { font-weight: 600; color: #0f172a; }
    .admin-name { font-size: 0.88rem; color: #475569; display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.2rem; }
    .admin-names-list { display: flex; flex-direction: column; }
    .admin-name i { color: #2563eb; }
    .table-message { text-align: center; color: #64748b; padding: 2rem; }

    .form-control { width: 100%; box-sizing: border-box; border: 1px solid #cbd5e1; border-radius: 0.45rem; padding: 0.55rem 0.65rem; font-size: 0.92rem; }
    .form-control:focus { outline: none; border-color: #60a5fa; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); }

    .badge { display: inline-block; border-radius: 9999px; padding: 0.24rem 0.62rem; font-size: 0.72rem; font-weight: 600; }
    .badge-subdomain { background: #f1f5f9; color: #475569; font-family: Consolas, monospace; }
    .badge-status.active { background: #dcfce7; color: #166534; }
    .badge-status.inactive { background: #fee2e2; color: #991b1b; }
    .badge-status.draft { background: #fef9c3; color: #854d0e; }
    .badge-status.unknown { background: #e2e8f0; color: #334155; }

    .btn { border: 0; border-radius: 0.45rem; cursor: pointer; font-weight: 600; padding: 0.58rem 0.95rem; font-size: 0.9rem; }
    .btn:disabled { opacity: 0.65; cursor: not-allowed; }
    .btn-primary { background: linear-gradient(90deg, #0ea5e9, #2563eb); color: #fff; }
    .btn-secondary { background: #e2e8f0; color: #0f172a; }
    .btn-icon { border: 1px solid #cbd5e1; background: #fff; color: #334155; border-radius: 0.4rem; padding: 0.36rem 0.65rem; cursor: pointer; font-size: 0.82rem; }
    .btn-icon:hover { background: #f8fafc; }
    .btn-icon i { font-size: 0.9rem; }
    .actions-group { display: flex; gap: 0.5rem; }

    .actions-group { display: flex; gap: 0.5rem; }

    .mt-4 { margin-top: 1.5rem; }
    .pt-4 { padding-top: 1.5rem; }
    .mb-3 { margin-bottom: 1rem; }
    .border-top { border-top: 1px solid #e2e8f0; }
    .d-flex { display: flex; }
    .justify-content-between { justify-content: space-between; }
    .align-items-center { align-items: center; }
    .text-muted { color: #64748b; }
    .small { font-size: 0.85rem; }
    .m-0 { margin: 0; }
    .btn-sm { padding: 0.35rem 0.75rem; font-size: 0.82rem; }
    .btn-outline-primary { background: #fff; border: 1px solid #2563eb; color: #2563eb; }
    .btn-outline-primary:hover { background: #eff6ff; }
    .bg-light { background: #f8fafc !important; }

    .modal-backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); display: flex; align-items: center; justify-content: center; padding: 1rem; z-index: 1000; }
    .modal-dialog { width: min(940px, 100%); background: #fff; border-radius: 0.85rem; overflow: hidden; max-height: calc(100vh - 2rem); display: flex; flex-direction: column; }
    .modal-header { display: flex; align-items: center; justify-content: space-between; background: #f8fafc; padding: 1rem 1.2rem; border-bottom: 1px solid #e2e8f0; }
    .modal-header h2 { margin: 0; font-size: 1.1rem; color: #0f172a; }
    .close-btn { border: 0; background: transparent; cursor: pointer; font-size: 1.5rem; color: #64748b; line-height: 1; }
    .modal-form { padding: 1rem 1.2rem 1.2rem; overflow: auto; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; }
    .form-group.full { grid-column: 1 / -1; }
    .form-group label { display: block; font-size: 0.83rem; color: #334155; margin-bottom: 0.3rem; }
    .form-group.checkbox label { display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 0.3rem; }
    .validation { margin-top: 1rem; background: #fee2e2; border: 1px solid #fecaca; color: #991b1b; padding: 0.7rem 0.85rem; border-radius: 0.45rem; font-size: 0.9rem; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 0.6rem; margin-top: 1rem; }

    @media (max-width: 960px) {
      .filters-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 640px) {
      .page-header { flex-direction: column; align-items: stretch; }
      .filters-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class SocietyManagementComponent implements OnInit {
  private platformService = inject(PlatformAdminService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  societies: Society[] = [];
  filteredSocieties: Society[] = [];
  federations: Federation[] = [];

  searchTerm = '';
  statusFilter = '';
  cityFilter = '';
  federationFilter = '';

  cities: string[] = [];
  federationNames: string[] = [];

  listLoading = true;
  detailsLoading = false;
  listError = '';
  successMessage = '';

  showOnboardingModal = false;
  saveLoading = false;
  saveError = '';
  logoFile: File | null = null;
  bannerFile: File | null = null;

  onboardingForm = this.fb.group({
    name: ['', [Validators.required]],
    code: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-z0-9_]+$/)]],
    requestedSubdomain: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(63), Validators.pattern(/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])$/)]],
    federationId: [null as number | null],
    description: [''],
    address: [''],
    city: [''],
    state: [''],
    country: [''],
    pincode: ['', [Validators.pattern(/^[0-9]{6}$/)]],
    totalBuildings: [0, [Validators.min(0)]],
    totalFlats: [0, [Validators.min(0)]],
    amenitiesInput: [''],
    isTownship: [false]
  });

  adminForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    email: ['', [Validators.required, Validators.email]],
    username: [''],
    passwordOption: ['mail'],
    password: ['']
  });

  showAdminModal = false;
  selectedSociety: Society | null = null;

  adminLoading = false;
  adminError = '';

  ngOnInit() {
    this.loadFederations();
    this.loadSocieties();
  }

  loadSocieties() {
    this.listLoading = true;
    this.listError = '';

    this.platformService.getSocieties(0, 50, {
      status: this.statusFilter,
      city: this.cityFilter,
      federation: this.federationFilter
    }).subscribe({
      next: data => {
        const rows = Array.isArray(data) ? data : (data.content || []);
        this.societies = rows.map((society: Society) => this.normalizeSociety(society));
        this.extractFilterOptions();
        this.applyClientFilters();
        this.listLoading = false;
        this.cdr.detectChanges();
      },
      error: (error: ApiError) => {
        this.listLoading = false;
        this.societies = [];
        this.filteredSocieties = [];
        this.listError = `Unable to load societies: ${error.message}`;
      }
    });
  }

  loadFederations() {
    this.platformService.getFederations(0, 200).subscribe({
      next: data => {
        const rows = Array.isArray(data) ? data : (data.content || []);
        this.federations = rows;
      }
    });
  }

  onSearchChange() {
    this.applyClientFilters();
  }

  onFilterChange(type: 'status' | 'city' | 'federation', event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    if (type === 'status') {
      this.statusFilter = value;
    } else if (type === 'city') {
      this.cityFilter = value;
    } else {
      this.federationFilter = value;
    }

    this.loadSocieties();
  }

  applyClientFilters() {
    const query = (this.searchTerm || '').trim().toLowerCase();
    if (!query) {
      this.filteredSocieties = [...this.societies];
      return;
    }

    this.filteredSocieties = this.societies.filter(society => {
      return (
        (society.name || '').toLowerCase().includes(query) ||
        (society.subdomain || '').toLowerCase().includes(query)
      );
    });
  }

  toggleStatus(society: Society) {
    const currentStatus = society.status || 'INACTIVE';
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    this.platformService.updateSocietyStatus(society.id, newStatus).subscribe({
      next: () => {
        society.status = newStatus;
        this.successMessage = `Society status updated to ${newStatus}.`;
        this.cdr.detectChanges();
        setTimeout(() => { 
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 2500);
      },
      error: (error: ApiError) => {
        this.listError = `Status update failed: ${error.message}`;
      }
    });
  }

  private router = inject(Router);

  openOnboardingModal() {
    this.router.navigate(['/platform/societies/create']);
  }

  viewDetails(society: Society) {
    this.router.navigate(['/platform/societies', society.id]);
  }

  editSociety(society: Society) {
    // Add query param so wizard knows to load existing society data
    this.router.navigate(['/platform/societies/create'], { queryParams: { id: society.id } });
  }

  resumeOnboarding(society: Society) {
    this.router.navigate(['/platform/societies/create'], { queryParams: { id: society.id, resume: true } });
  }

  openAdminModal(society: Society) {
    this.selectedSociety = society;
    this.adminError = '';
    this.adminForm.reset({ passwordOption: 'mail' });
    this.showAdminModal = true;
  }

  closeAdminModal() {
    this.showAdminModal = false;
  }

  submitAdminAssignment() {
    if (this.adminForm.invalid || !this.selectedSociety) return;

    this.adminLoading = true;
    this.adminError = '';

    const formVal = this.adminForm.value;
    const request = {
      societyId: this.selectedSociety.id,
      firstName: formVal.firstName,
      lastName: formVal.lastName,
      email: formVal.email,
      mobile: formVal.mobile,
      username: formVal.username,
      sendPasswordViaEmail: formVal.passwordOption === 'mail',
      password: formVal.passwordOption === 'manual' ? formVal.password : null
    };

    this.platformService.assignSocietyAdminStep(request).subscribe({
      next: () => {
        this.adminLoading = false;
        this.closeAdminModal();
        this.successMessage = 'Admin assigned successfully.';
        this.loadSocieties(); // Refresh list to show admin name
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err: ApiError) => {
        this.adminLoading = false;
        this.adminError = `Assignment failed: ${err.message}`;
      }
    });
  }

  getStatusClass(status?: string): string {
    if (!status) {
      return 'unknown';
    }
    const normalized = status.toLowerCase();
    return ['active', 'inactive', 'draft'].includes(normalized) ? normalized : 'unknown';
  }

  private extractFilterOptions() {
    const cities = new Set<string>();
    const federationNames = new Set<string>();

    this.societies.forEach(society => {
      if (society.city) {
        cities.add(society.city);
      }
      if (society.federationName) {
        federationNames.add(society.federationName);
      }
    });

    this.cities = Array.from(cities).sort((a, b) => a.localeCompare(b));
    this.federationNames = Array.from(federationNames).sort((a, b) => a.localeCompare(b));
  }

  private normalizeSociety(society: Society): Society {
    return {
      id: society.id,
      name: society.name || '-',
      federationName: society.federationName || '',
      subdomain: society.subdomain || '',
      city: society.city || '',
      adminNames: society.adminNames || [],
      totalFlats: society.totalFlats ?? 0,
      status: (society.status || 'DRAFT') as Society['status']
    };
  }
}
