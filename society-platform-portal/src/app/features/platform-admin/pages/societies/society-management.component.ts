import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Society Management</h1>
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
            [value]="searchTerm"
            (input)="onSearchChange($event)"
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
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="listLoading">
              <td colspan="7" class="table-message">Loading societies...</td>
            </tr>
            <tr *ngIf="!listLoading && filteredSocieties.length === 0">
              <td colspan="7" class="table-message">No societies found.</td>
            </tr>
            <tr *ngFor="let society of filteredSocieties">
              <td class="name-col">{{ society.name }}</td>
              <td>{{ society.federationName || '-' }}</td>
              <td><span class="badge badge-subdomain">{{ society.subdomain || '-' }}</span></td>
              <td>{{ society.city || '-' }}</td>
              <td>{{ society.totalFlats ?? 0 }}</td>
              <td>
                <span class="badge badge-status" [ngClass]="getStatusClass(society.status)">
                  {{ society.status || 'UNKNOWN' }}
                </span>
              </td>
              <td>
                <button class="btn-icon" (click)="toggleStatus(society)" [disabled]="listLoading">
                  {{ society.status === 'ACTIVE' ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal-backdrop" *ngIf="showOnboardingModal">
        <div class="modal-dialog">
          <div class="modal-header">
            <h2>Society Onboarding</h2>
            <button type="button" class="close-btn" (click)="closeOnboardingModal()">&times;</button>
          </div>

          <form [formGroup]="onboardingForm" (ngSubmit)="submitOnboarding()" class="modal-form">
            <div class="grid">
              <div class="form-group">
                <label>Name *</label>
                <input class="form-control" formControlName="name" type="text">
              </div>
              <div class="form-group">
                <label>Code *</label>
                <input class="form-control" formControlName="code" type="text" placeholder="ABC_001">
              </div>
              <div class="form-group">
                <label>Requested Subdomain *</label>
                <input class="form-control" formControlName="requestedSubdomain" type="text" placeholder="my-society">
              </div>
              <div class="form-group">
                <label>Federation</label>
                <select class="form-control" formControlName="federationId">
                  <option [ngValue]="null">None</option>
                  <option *ngFor="let federation of federations" [ngValue]="federation.id">{{ federation.name }}</option>
                </select>
              </div>
              <div class="form-group full">
                <label>Description</label>
                <textarea class="form-control" rows="2" formControlName="description"></textarea>
              </div>
              <div class="form-group full">
                <label>Address</label>
                <textarea class="form-control" rows="2" formControlName="address"></textarea>
              </div>
              <div class="form-group">
                <label>City</label>
                <input class="form-control" formControlName="city" type="text">
              </div>
              <div class="form-group">
                <label>State</label>
                <input class="form-control" formControlName="state" type="text">
              </div>
              <div class="form-group">
                <label>Country</label>
                <input class="form-control" formControlName="country" type="text">
              </div>
              <div class="form-group">
                <label>Pincode</label>
                <input class="form-control" formControlName="pincode" type="text" placeholder="6 digits">
              </div>
              <div class="form-group full checkbox">
                <label>
                  <input formControlName="isTownship" type="checkbox">
                  Township
                </label>
              </div>
              <div class="form-group">
                <label>Logo (png/jpeg/webp, max 2MB)</label>
                <input class="form-control" type="file" accept="image/png,image/jpeg,image/webp" (change)="onFileSelected($event, 'logo')">
              </div>
              <div class="form-group">
                <label>Banner (png/jpeg/webp, max 5MB)</label>
                <input class="form-control" type="file" accept="image/png,image/jpeg,image/webp" (change)="onFileSelected($event, 'banner')">
              </div>
            </div>

            <div class="validation" *ngIf="saveError">{{ saveError }}</div>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeOnboardingModal()">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="onboardingForm.invalid || saveLoading">
                {{ saveLoading ? 'Saving...' : 'Create Society' }}
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

    societies: Society[] = [];
    filteredSocieties: Society[] = [];
    federations: Federation[] = [];

    searchTerm = '';
    statusFilter = '';
    cityFilter = '';
    federationFilter = '';

    cities: string[] = [];
    federationNames: string[] = [];

    listLoading = false;
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
        isTownship: [false]
    });

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

    onSearchChange(event: Event) {
        this.searchTerm = (event.target as HTMLInputElement).value;
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
        const query = this.searchTerm.trim().toLowerCase();
        this.filteredSocieties = this.societies.filter(society => {
            if (!query) {
                return true;
            }

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
                setTimeout(() => this.successMessage = '', 2500);
            },
            error: (error: ApiError) => {
                this.listError = `Status update failed: ${error.message}`;
            }
        });
    }

    openOnboardingModal() {
        this.saveError = '';
        this.logoFile = null;
        this.bannerFile = null;
        this.onboardingForm.reset({
            name: '',
            code: '',
            requestedSubdomain: '',
            federationId: null,
            description: '',
            address: '',
            city: '',
            state: '',
            country: '',
            pincode: '',
            isTownship: false
        });
        this.showOnboardingModal = true;
    }

    closeOnboardingModal() {
        this.showOnboardingModal = false;
    }

    onFileSelected(event: Event, type: 'logo' | 'banner') {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0] || null;

        if (type === 'logo') {
            this.logoFile = file;
        } else {
            this.bannerFile = file;
        }
    }

    submitOnboarding() {
        if (this.onboardingForm.invalid) {
            this.onboardingForm.markAllAsTouched();
            this.saveError = 'Please correct form validation errors before submitting.';
            return;
        }

        const formValue = this.onboardingForm.getRawValue();
        const request: SocietyOnboardingRequest = {
            name: (formValue.name || '').trim(),
            code: (formValue.code || '').trim().toUpperCase(),
            federationId: formValue.federationId ?? null,
            requestedSubdomain: (formValue.requestedSubdomain || '').trim().toLowerCase(),
            description: (formValue.description || '').trim(),
            address: (formValue.address || '').trim(),
            city: (formValue.city || '').trim(),
            state: (formValue.state || '').trim(),
            country: (formValue.country || '').trim(),
            pincode: (formValue.pincode || '').trim(),
            isTownship: !!formValue.isTownship
        };

        this.saveLoading = true;
        this.saveError = '';

        this.platformService.createSociety(request, this.logoFile, this.bannerFile).subscribe({
            next: created => {
                this.saveLoading = false;
                this.closeOnboardingModal();
                this.successMessage = `Society onboarded successfully: ${created.name}`;
                this.loadSocieties();
                setTimeout(() => this.successMessage = '', 3000);
            },
            error: (error: ApiError) => {
                this.saveLoading = false;
                this.saveError = `Onboarding failed: ${error.message}`;
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
            totalFlats: society.totalFlats ?? 0,
            status: (society.status || 'DRAFT') as Society['status']
        };
    }
}
