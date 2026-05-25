import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { BillingService } from '../../core/services/billing.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-billing-config',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="billing-config-container animate-up">
      <header class="page-header">
        <div class="header-content">
          <h1>Payment <span>Configuration</span></h1>
          <p>Manage society maintenance and configuration rules.</p>
        </div>
      </header>

      <div class="alerts" *ngIf="successMessage || errorMessage">
        <div class="alert alert-success" *ngIf="successMessage">
          {{ successMessage }}
        </div>
        <div class="alert alert-danger" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
      </div>

      <div class="tabs">
          <button [class.active]="activeTab === 'maintenance'" (click)="activeTab = 'maintenance'">Maintenance Cost</button>
          <button [class.active]="activeTab === 'adhoc'" (click)="activeTab = 'adhoc'">Adhoc/Event Charges</button>
      </div>

      <div class="glass-card mt-4" *ngIf="activeTab === 'maintenance'">
        <h3>Maintenance Configuration</h3>
        <p class="subtitle">Set up monthly maintenance structure specific to wings, or a global standard.</p>
        <form [formGroup]="configForm" (ngSubmit)="saveConfig()">
          <div formArrayName="configs">
            <div *ngFor="let config of configs.controls; let i=index" [formGroupName]="i" class="config-block glass-card nested-card">
              <div class="config-header">
                  <h4>Configuration #{{i + 1}}</h4>
                  <button type="button" class="btn btn-danger btn-sm" (click)="removeConfig(i)">Remove</button>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Applicable Wings (Comma separated, empty for all)</label>
                  <input type="text" formControlName="applicableWings" placeholder="A, B, C" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Maintenance Type *</label>
                  <select formControlName="maintenanceType" class="form-control">
                    <option value="FIXED">Fixed Amount</option>
                    <option value="AREA_BASED">Area Based</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group" *ngIf="config.get('maintenanceType')?.value !== 'AREA_BASED'">
                  <label>Fixed Amount (₹) *</label>
                  <input type="number" formControlName="fixedAmount" class="form-control" />
                </div>
                <div class="form-group" *ngIf="config.get('maintenanceType')?.value !== 'FIXED'">
                  <label>Rate Per Sq Ft (₹) *</label>
                  <input type="number" formControlName="ratePerSqFt" class="form-control" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Due Days from Generation *</label>
                  <input type="number" formControlName="dueDaysFromGeneration" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Penalty Per Day (₹) *</label>
                  <input type="number" formControlName="penaltyPerDay" class="form-control" />
                </div>
              </div>
            </div>
          </div>
          
          <div class="actions">
            <button type="button" class="btn btn-outline mt-3" (click)="addConfig()">+ Add Wing Config</button>
            <button type="submit" class="btn btn-primary mt-3" [disabled]="configForm.invalid || isLoading">
              <span *ngIf="isLoading"><i class="fas fa-spinner fa-spin"></i> Saving...</span>
              <span *ngIf="!isLoading">Save Configurations</span>
            </button>
          </div>
        </form>
      </div>

      <div class="glass-card mt-4" *ngIf="activeTab === 'adhoc'">
        <h3>Collect Ad-Hoc / Event Funds</h3>
        <p class="subtitle">Generate custom bills like fine or festive charges based on flat, wing, or society-wide.</p>
        <form [formGroup]="adhocForm" (ngSubmit)="generateAdhoc()">
            <div class="form-row">
                <div class="form-group">
                    <label>Module/Category *</label>
                    <select formControlName="billType" class="form-control">
                        <option value="FINE">Fine</option>
                        <option value="EVENT">Event Taxonomy</option>
                        <option value="OTHER">Other Purpose</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Title *</label>
                    <input type="text" formControlName="title" placeholder="e.g. Diwali Fund" class="form-control" />
                </div>
            </div>
            
            <div class="form-group">
                <label>Description (Details)</label>
                <textarea formControlName="description" class="form-control" rows="3"></textarea>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Amount (₹) *</label>
                    <input type="number" formControlName="amount" class="form-control" />
                </div>
                <div class="form-group">
                    <label>Due Date</label>
                    <input type="date" formControlName="dueDate" class="form-control" />
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Specific Wings (Comma separated, empty for all)</label>
                    <input type="text" formControlName="wingsString" placeholder="A, B" class="form-control" />
                </div>
                <div class="form-group">
                    <label>Specific Flat IDs (Comma separated, overrides wings)</label>
                    <input type="text" formControlName="flatIdsString" placeholder="101, 102" class="form-control" />
                </div>
            </div>

            <button type="submit" class="btn btn-primary mt-3" [disabled]="adhocForm.invalid || isAdhocLoading">
                <span *ngIf="isAdhocLoading"><i class="fas fa-spinner fa-spin"></i> Processing...</span>
                <span *ngIf="!isAdhocLoading">Generate Bills</span>
            </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .billing-config-container { padding: 1rem 0; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; h1 { font-size: 2.25rem; font-weight: 800; margin: 0; span { color: var(--primary-color, #2563eb); } } p { color: #64748b; margin: 0.5rem 0 0 0; } }
    .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border-radius: 1rem; padding: 2rem; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid rgba(255, 255, 255, 0.5); }
    .nested-card { padding: 1.5rem; margin-bottom: 1rem; background: rgba(240, 248, 255, 0.5); border-left: 4px solid var(--primary-color, #2563eb); }
    .config-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; h4 { margin: 0; } }
    .mt-4 { margin-top: 2rem; }
    .mt-3 { margin-top: 1.5rem; }
    .subtitle { color: #64748b; margin-bottom: 1.5rem; }
    
    .tabs { display: flex; gap: 1rem; margin-bottom: 1rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
    .tabs button { background: none; border: none; font-size: 1.1rem; font-weight: 600; color: #64748b; cursor: pointer; padding: 0.5rem 1rem; position: relative; }
    .tabs button.active { color: var(--primary-color, #2563eb); }
    .tabs button.active::after { content: ''; position: absolute; bottom: -11px; left: 0; width: 100%; height: 2px; background: var(--primary-color, #2563eb); }

    .form-row { display: flex; gap: 1.5rem; margin-bottom: 1.5rem; }
    .form-group { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { font-weight: 600; font-size: 0.875rem; color: #475569; }
    .form-control { padding: 0.75rem 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; outline: none; transition: all 0.2s; }
    .form-control:focus { border-color: var(--primary-color, #2563eb); }
    
    .alert { padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem; font-weight: 600; }
    .alert-success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .alert-danger { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

    .btn { padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; }
    .btn-primary { background: var(--primary-color, #2563eb); color: white; }
    .btn-primary:hover:not(:disabled) { background: #1d4ed8; }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
    .btn-outline { background: white; border: 1px solid #e2e8f0; color: #1e293b; }
    .btn-outline:hover { background: #f8fafc; }
    .btn-danger { background: white; border: 1px solid #ef4444; color: #ef4444; }
    .btn-danger:hover { background: #fee2e2; }
    .btn-sm { padding: 0.4rem 0.8rem; font-size: 0.875rem; }

    .actions { display: flex; gap: 1rem; }
    
    .animate-up { animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class BillingConfigComponent implements OnInit {
  activeTab: string = 'maintenance';
  configForm: FormGroup;
  adhocForm: FormGroup;
  
  isLoading = false;
  isAdhocLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private billingService: BillingService, private cdr: ChangeDetectorRef) {
    this.configForm = this.fb.group({
      configs: this.fb.array([])
    });

    this.adhocForm = this.fb.group({
      billType: ['EVENT', Validators.required],
      title: ['', Validators.required],
      description: [''],
      amount: ['', [Validators.required, Validators.min(1)]],
      dueDate: [''],
      wingsString: [''],
      flatIdsString: ['']
    });
  }

  ngOnInit() {
    this.loadConfigs();
  }

  get configs() {
    return this.configForm.get('configs') as FormArray;
  }

  createConfigGroup(configData?: any): FormGroup {
    return this.fb.group({
      applicableWings: [configData?.applicableWings || ''],
      maintenanceType: [configData?.maintenanceType || 'FIXED', Validators.required],
      fixedAmount: [configData?.fixedAmount || 0],
      ratePerSqFt: [configData?.ratePerSqFt || 0],
      dueDaysFromGeneration: [configData?.dueDaysFromGeneration || 7, Validators.required],
      penaltyPerDay: [configData?.penaltyPerDay || 0, Validators.required]
    });
  }

  addConfig() {
    this.configs.push(this.createConfigGroup());
  }

  removeConfig(index: number) {
    this.configs.removeAt(index);
  }

  loadConfigs() {
    this.billingService.getBillingConfigs().subscribe({
      next: (res: any) => {
          this.configs.clear();
          if (res && res.length > 0) {
              res.forEach((cfg: any) => this.configs.push(this.createConfigGroup(cfg)));
          } else {
              this.addConfig();
          }
      },
      error: () => this.showError('Failed to load maintenance configurations.')
    });
  }

  saveConfig() {
    if (this.configForm.invalid) return;
    this.isLoading = true;
    this.cdr.detectChanges();
    this.billingService.updateBillingConfigs({ configs: this.configForm.value.configs }).subscribe({
      next: () => {
        this.isLoading = false;
        this.showSuccess('Maintenance configurations saved successfully.');
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.showError(err?.error?.message || 'Failed to save configurations.');
        this.cdr.detectChanges();
      }
    });
  }

  generateAdhoc() {
    if (this.adhocForm.invalid) return;
    this.isAdhocLoading = true;
    const formVal = this.adhocForm.value;
    
    let wgs = formVal.wingsString ? formVal.wingsString.split(',').map((w: string) => w.trim()).filter((w: string) => w) : [];
    let fIds = formVal.flatIdsString ? formVal.flatIdsString.split(',').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id)) : [];

    const payload = {
        title: formVal.title,
        description: formVal.description,
        amount: formVal.amount,
        billType: formVal.billType,
        dueDate: formVal.dueDate || null,
        wings: wgs.length > 0 ? wgs : null,
        flatIds: fIds.length > 0 ? fIds : null
    };

    this.billingService.generateAdhocBills(payload).subscribe({
        next: () => {
            this.isAdhocLoading = false;
            this.showSuccess('Ad-Hoc bills generated successfully!');
            this.adhocForm.reset({ billType: 'EVENT' });
            this.cdr.detectChanges();
        },
        error: (err: any) => {
            this.isAdhocLoading = false;
            this.showError(err?.error?.message || 'Failed to generate Ad-Hoc bills.');
            this.cdr.detectChanges();
        }
    });
  }

  showSuccess(msg: string) {
    this.successMessage = msg;
    this.errorMessage = '';
    this.cdr.detectChanges();
    setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 5000);
  }

  showError(msg: string) {
    this.errorMessage = msg;
    this.successMessage = '';
    this.cdr.detectChanges();
    setTimeout(() => { this.errorMessage = ''; this.cdr.detectChanges(); }, 5000);
  }
}
