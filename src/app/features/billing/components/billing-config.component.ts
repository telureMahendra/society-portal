import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillingService } from '../services/billing.service';
import { BillingConfiguration } from '../models/billing.model';

@Component({
  selector: 'app-billing-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="billing-config-container">
      <div class="page-header">
        <div class="header-content">
          <h1>Billing Configurations</h1>
          <p>Setup automated monthly recurring charges</p>
        </div>
        <button class="btn-primary" (click)="openCreateModal()">
          <i class="fas fa-plus"></i> New Configuration
        </button>
      </div>

      <div class="data-table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Applicability</th>
              <th>Due Day</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let config of configs">
              <td><strong>{{ config.configurationName }}</strong></td>
              <td>₹{{ config.billingAmount }}</td>
              <td>{{ config.applicability }}</td>
              <td>{{ config.dueDayOfMonth }}</td>
              <td>
                <span class="status-badge" [ngClass]="config.active ? 'active' : 'inactive'">
                  {{ config.active ? 'ACTIVE' : 'INACTIVE' }}
                </span>
              </td>
              <td class="actions">
                <button class="btn-icon danger" (click)="deleteConfig(config.id!)">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="configs.length === 0">
              <td colspan="6" class="empty-state">No configurations found. Create one to get started!</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Create Modal -->
      <div class="modal-backdrop" *ngIf="showModal">
        <div class="modal">
          <div class="modal-header">
            <h2>Create Configuration</h2>
            <button class="close-btn" (click)="showModal = false"><i class="fas fa-times"></i></button>
          </div>
          <div class="modal-body form-grid">
            
            <div class="form-group">
              <label>Configuration Name</label>
              <input type="text" [(ngModel)]="newConfig.configurationName" placeholder="e.g. Monthly Maintenance">
            </div>

            <div class="form-group">
              <label>Billing Amount (₹)</label>
              <input type="number" [(ngModel)]="newConfig.billingAmount">
            </div>

            <div class="form-group">
              <label>Due Day of Month</label>
              <input type="number" [(ngModel)]="newConfig.dueDayOfMonth" min="1" max="31">
            </div>

            <div class="form-group">
              <label>Applicability</label>
              <select [(ngModel)]="newConfig.applicability">
                <option value="SOCIETY">Entire Society</option>
                <option value="WING">Specific Wing</option>
                <option value="FLAT">Specific Flat</option>
              </select>
            </div>

            <div class="form-group" *ngIf="newConfig.applicability === 'WING'">
              <label>Target Wing</label>
              <input type="text" [(ngModel)]="newConfig.targetWing" placeholder="e.g. A">
            </div>
            
            <div class="form-group" *ngIf="newConfig.applicability === 'FLAT'">
              <label>Target Flat ID</label>
              <input type="number" [(ngModel)]="newConfig.targetFlatId">
            </div>

            <div class="form-group">
              <label>Effective Start Date</label>
              <input type="date" [(ngModel)]="newConfig.effectiveStartDate">
            </div>

          </div>
          <div class="modal-footer">
            <button class="btn-outline" (click)="showModal = false">Cancel</button>
            <button class="btn-primary" (click)="saveConfig()">Save Configuration</button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .billing-config-container { padding: 24px; animation: fadeIn 0.4s ease-out; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h1 { font-size: 28px; font-weight: 700; color: #1e293b; margin: 0 0 8px 0; }
    .page-header p { color: #64748b; margin: 0; }
    .btn-primary { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 8px; }
    .btn-outline { background: white; color: #3b82f6; border: 1px solid #3b82f6; padding: 10px 20px; border-radius: 8px; font-weight: 500; cursor: pointer; }
    .btn-icon { width: 36px; height: 36px; border-radius: 8px; border: none; background: #f1f5f9; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .btn-icon.danger { color: #ef4444; } .btn-icon.danger:hover { background: #fee2e2; }
    .data-table-card { background: white; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { background: #f8fafc; padding: 16px; text-align: left; font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0; }
    .data-table td { padding: 16px; border-bottom: 1px solid #e2e8f0; }
    .empty-state { text-align: center; padding: 48px; color: #64748b; }
    .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .status-badge.active { background: #dcfce7; color: #16a34a; }
    .status-badge.inactive { background: #f1f5f9; color: #64748b; }
    .modal-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; border-radius: 16px; width: 500px; max-width: 90%; }
    .modal-header { padding: 20px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
    .modal-header h2 { margin: 0; font-size: 20px; }
    .close-btn { background: none; border: none; font-size: 20px; cursor: pointer; color: #64748b; }
    .modal-body { padding: 24px; }
    .form-grid { display: flex; flex-direction: column; gap: 16px; }
    .form-group label { display: block; margin-bottom: 8px; color: #475569; font-weight: 500; font-size: 14px; }
    .form-group input, .form-group select { width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; }
    .modal-footer { padding: 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 12px; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class BillingConfigComponent implements OnInit {
  configs: BillingConfiguration[] = [];
  showModal = false;
  
  newConfig: BillingConfiguration = {
    configurationName: '',
    billingCycle: 'MONTHLY',
    billingAmount: 0,
    dueDayOfMonth: 5,
    lateFeeApplicable: false,
    applicability: 'SOCIETY',
    effectiveStartDate: new Date().toISOString().split('T')[0],
    active: true
  };

  constructor(private billingService: BillingService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.loadConfigs(); }

  loadConfigs() {
    this.billingService.getConfigurations({ page: 0, size: 50 }).subscribe(res => {
      this.configs = res.content;
      this.cdr.detectChanges();
    });
  }

  openCreateModal() {
    this.newConfig = {
      configurationName: '',
      billingCycle: 'MONTHLY',
      billingAmount: 0,
      dueDayOfMonth: 5,
      lateFeeApplicable: false,
      applicability: 'SOCIETY',
      effectiveStartDate: new Date().toISOString().split('T')[0],
      active: true
    };
    this.showModal = true;
  }

  saveConfig() {
    this.billingService.createConfiguration(this.newConfig).subscribe(() => {
      this.showModal = false;
      this.loadConfigs();
    });
  }

  deleteConfig(id: number) {
    if(confirm('Delete this configuration?')) {
      this.billingService.deleteConfiguration(id).subscribe(() => this.loadConfigs());
    }
  }
}
