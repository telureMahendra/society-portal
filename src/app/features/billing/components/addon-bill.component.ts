import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillingService } from '../services/billing.service';
import { AddonBill } from '../models/billing.model';
import { MemberService } from '../../../core/services/member.service';
import { Member } from '../../../core/models/member.model';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-addon-bill',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="addon-bill-container">
      <div class="page-header">
        <div class="header-content">
          <h1>Add-On Bills</h1>
          <p>Manage specific charges like event fees, move-in charges, etc.</p>
        </div>
        <button class="btn-primary" (click)="openCreateModal()">
          <i class="fas fa-plus"></i> Create Bill
        </button>
      </div>

      <div class="data-table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let bill of bills">
              <td><strong>{{ bill.title }}</strong></td>
              <td><span class="category-badge">{{ bill.category }}</span></td>
              <td>₹{{ bill.amount }}</td>
              <td>{{ bill.dueDate | date }}</td>
              <td>
                <span class="status-badge" [ngClass]="bill.status.toLowerCase()">
                  {{ bill.status }}
                </span>
              </td>
              <td class="actions">
                <button class="btn-icon danger" *ngIf="bill.status !== 'PAID'" (click)="deleteBill(bill.id!)">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="bills.length === 0">
              <td colspan="6" class="empty-state">No add-on bills found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Create Modal -->
      <div class="modal-backdrop" *ngIf="showModal">
        <div class="modal">
          <div class="modal-header">
            <h2>Create Add-On Bill</h2>
            <button class="close-btn" (click)="showModal = false" [disabled]="isSaving"><i class="fas fa-times"></i></button>
          </div>
          <div class="modal-body form-grid">
            
            <div class="form-group">
              <label>Bill Title</label>
              <input type="text" [(ngModel)]="newBill.title" placeholder="e.g. Festival Contribution">
            </div>

            <div class="form-row">
              <div class="form-group half">
                <label>Category</label>
                <select [(ngModel)]="newBill.category">
                  <option value="EVENT">Event</option>
                  <option value="PENALTY">Penalty</option>
                  <option value="MOVE_IN">Move In Charge</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div class="form-group half">
                <label>Amount (₹)</label>
                <input type="number" [(ngModel)]="newBill.amount">
              </div>
            </div>

            <div class="form-group">
              <label>Due Date</label>
              <input type="date" [(ngModel)]="newBill.dueDate">
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="newBill.description" rows="2" class="form-control" placeholder="Optional details..."></textarea>
            </div>

            <div class="divider"></div>

            <!-- Target Type Toggle -->
            <div class="target-toggle-section">
              <h3>Target Recipients</h3>
              <div class="target-toggle">
                <button type="button" [class.active]="targetType === 'PUBLIC'" (click)="setTargetType('PUBLIC')">
                  <i class="fas fa-users"></i> All Residents
                </button>
                <button type="button" [class.active]="targetType === 'SPECIFIC'" (click)="setTargetType('SPECIFIC')">
                  <i class="fas fa-user-check"></i> Specific Flats
                </button>
              </div>
            </div>

            <!-- Public mode info -->
            <div class="public-info" *ngIf="targetType === 'PUBLIC'">
              <i class="fas fa-info-circle"></i>
              This bill will be sent to <strong>all {{ allMembers.length }} residents</strong> of the society.
            </div>

            <!-- Specific mode: flat search + member list -->
            <ng-container *ngIf="targetType === 'SPECIFIC'">
              <div class="form-group search-group">
                <label>Search by Flat Number or Wing</label>
                <div class="search-input-wrapper">
                  <i class="fas fa-search"></i>
                  <input type="text" [(ngModel)]="searchFlatNumber" placeholder="e.g. 101 or Wing A">
                </div>
              </div>

              <div class="user-selection-list">
                <!-- Prompt when nothing typed -->
                <div class="empty-users hint" *ngIf="!searchFlatNumber.trim()">
                  <i class="fas fa-search"></i> Type a flat number or wing to find residents.
                </div>

                <!-- Results -->
                <ng-container *ngIf="searchFlatNumber.trim()">
                  <div class="user-item" *ngFor="let member of filteredMembers" (click)="toggleUserSelection(member)">
                    <div class="checkbox-wrapper">
                      <input type="checkbox" [checked]="isUserSelected(member)" (click)="$event.stopPropagation()">
                    </div>
                    <div class="user-details">
                      <span class="user-name">{{ member.firstName }} {{ member.lastName }}</span>
                      <span class="user-flat" *ngIf="member.unitMapping && member.unitMapping.length > 0">
                        {{ member.unitMapping[0].wing }} – {{ member.unitMapping[0].flatNumber }}
                      </span>
                      <span class="user-type" [ngClass]="member.type.toLowerCase()">{{ member.type }}</span>
                    </div>
                  </div>
                  <div class="empty-users" *ngIf="filteredMembers.length === 0">
                    No residents found for "{{ searchFlatNumber }}".
                  </div>
                </ng-container>
              </div>

              <div class="selection-summary" *ngIf="selectedUsers.length > 0">
                <i class="fas fa-check-circle"></i> {{ selectedUsers.length }} resident(s) selected.
                <button type="button" class="clear-link" (click)="selectedUsers = []">Clear</button>
              </div>
            </ng-container>

          </div>
          <div class="modal-footer">
            <button class="btn-outline" (click)="showModal = false" [disabled]="isSaving">Cancel</button>
            <button class="btn-primary" (click)="saveBill()" [disabled]="isSaving || !canSave">
              <i class="fas" [ngClass]="isSaving ? 'fa-spinner fa-spin' : 'fa-check'"></i>
              {{ isSaving ? 'Creating...' : (targetType === 'PUBLIC' ? 'Send to All (' + allMembers.length + ')' : 'Create Bills (' + selectedUsers.length + ')') }}
            </button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .addon-bill-container { padding: 24px; animation: fadeIn 0.4s ease-out; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h1 { font-size: 28px; font-weight: 700; color: #1e293b; margin: 0 0 8px 0; }
    .page-header p { color: #64748b; margin: 0; }
    .btn-primary { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
    .btn-primary:hover:not(:disabled) { background: #2563eb; }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
    .btn-outline { background: white; color: #3b82f6; border: 1px solid #3b82f6; padding: 10px 20px; border-radius: 8px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .btn-outline:hover:not(:disabled) { background: #f8fafc; }
    .btn-icon { width: 36px; height: 36px; border-radius: 8px; border: none; background: #f1f5f9; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .btn-icon.danger { color: #ef4444; } .btn-icon.danger:hover { background: #fee2e2; }
    .data-table-card { background: white; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { background: #f8fafc; padding: 16px; text-align: left; font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0; }
    .data-table td { padding: 16px; border-bottom: 1px solid #e2e8f0; }
    .empty-state { text-align: center; padding: 48px; color: #64748b; }
    .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .status-badge.pending { background: #fefce8; color: #ca8a04; }
    .status-badge.paid { background: #dcfce7; color: #16a34a; }
    .category-badge { background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
    .modal-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
    .modal { background: white; border-radius: 16px; width: 550px; max-width: 95%; max-height: 90vh; display: flex; flex-direction: column; }
    .modal-header { padding: 20px 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
    .modal-header h2 { margin: 0; font-size: 20px; font-weight: 700; color: #0f172a; }
    .close-btn { background: none; border: none; font-size: 20px; cursor: pointer; color: #64748b; transition: color 0.2s; }
    .close-btn:hover { color: #0f172a; }
    .modal-body { padding: 24px; overflow-y: auto; flex-grow: 1; }
    .form-grid { display: flex; flex-direction: column; gap: 16px; }
    .form-row { display: flex; gap: 16px; }
    .form-group.half { flex: 1; }
    .form-group label { display: block; margin-bottom: 8px; color: #475569; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; }
    .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; font-size: 14px; transition: border-color 0.2s; outline: none; }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
    .divider { height: 1px; background: #e2e8f0; margin: 8px 0; }
    h3 { margin: 0; font-size: 16px; color: #0f172a; font-weight: 600; }
    .search-input-wrapper { position: relative; }
    .search-input-wrapper i { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
    .search-input-wrapper input { padding-left: 36px; }
    .user-selection-list { border: 1px solid #e2e8f0; border-radius: 8px; max-height: 200px; overflow-y: auto; background: #f8fafc; }
    .user-item { display: flex; align-items: center; padding: 12px; border-bottom: 1px solid #e2e8f0; cursor: pointer; transition: background 0.2s; background: white; }
    .user-item:hover { background: #f1f5f9; }
    .user-item:last-child { border-bottom: none; }
    .checkbox-wrapper { margin-right: 12px; display: flex; align-items: center; }
    .checkbox-wrapper input { width: 18px; height: 18px; cursor: pointer; accent-color: #3b82f6; }
    .user-details { display: flex; align-items: center; flex-grow: 1; gap: 12px; flex-wrap: wrap; }
    .user-name { font-weight: 600; color: #1e293b; font-size: 14px; min-width: 120px; }
    .user-flat { background: #e2e8f0; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; color: #475569; }
    .user-type { font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
    .user-type.owner { background: #dcfce7; color: #166534; }
    .user-type.tenant { background: #eff6ff; color: #1e40af; }
    .empty-users { padding: 24px; text-align: center; color: #64748b; font-size: 14px; background: white; }
    .empty-users.hint { color: #94a3b8; }
    .selection-summary { background: #eff6ff; color: #1d4ed8; padding: 12px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 8px; border: 1px dashed #bfdbfe; }
    .clear-link { margin-left: auto; background: none; border: none; color: #ef4444; font-size: 13px; cursor: pointer; font-weight: 600; padding: 0; }
    .target-toggle-section { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .target-toggle { display: flex; background: #f1f5f9; border-radius: 8px; padding: 4px; gap: 4px; }
    .target-toggle button { flex: 1; padding: 8px 16px; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; background: transparent; color: #64748b; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
    .target-toggle button.active { background: white; color: #3b82f6; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .public-info { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 12px 16px; border-radius: 8px; font-size: 14px; display: flex; align-items: center; gap: 8px; }
    .modal-footer { padding: 20px 24px; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 12px; flex-shrink: 0; background: #f8fafc; border-radius: 0 0 16px 16px; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AddonBillComponent implements OnInit {
  bills: AddonBill[] = [];
  showModal = false;
  isSaving = false;
  
  newBill: AddonBill = {
    title: '',
    category: 'EVENT',
    amount: null as any,
    dueDate: new Date().toISOString().split('T')[0],
    ownerId: 0,
    unitId: 0,
    status: 'PENDING',
    paid: false
  };

  // User Selection Properties
  allMembers: Member[] = [];
  searchFlatNumber: string = '';
  selectedUsers: Member[] = [];
  targetType: 'PUBLIC' | 'SPECIFIC' = 'SPECIFIC';

  constructor(
    private billingService: BillingService,
    private memberService: MemberService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { 
    this.loadBills(); 
    this.loadMembers();
  }

  loadBills() {
    this.billingService.getAddonBills({ page: 0, size: 50 }).subscribe(res => {
      this.bills = res.content;
      this.cdr.detectChanges();
    });
  }

  loadMembers() {
    this.memberService.getMembers().subscribe(members => {
      this.allMembers = members;
      this.cdr.detectChanges();
    });
  }

  get filteredMembers(): Member[] {
    const search = this.searchFlatNumber.trim().toLowerCase();
    if (!search) return [];
    return this.allMembers.filter(member => {
      if (!member.unitMapping || member.unitMapping.length === 0) return false;
      return member.unitMapping.some(u =>
        String(u.flatNumber || '').toLowerCase().includes(search) ||
        String(u.wing || '').toLowerCase().includes(search)
      );
    });
  }

  get canSave(): boolean {
    if (!this.newBill.title || !this.newBill.amount || !this.newBill.dueDate) return false;
    if (this.targetType === 'PUBLIC') return this.allMembers.length > 0;
    return this.selectedUsers.length > 0;
  }

  setTargetType(type: 'PUBLIC' | 'SPECIFIC') {
    this.targetType = type;
    this.selectedUsers = [];
    this.searchFlatNumber = '';
  }

  openCreateModal() {
    this.newBill = {
      title: '',
      category: 'EVENT',
      amount: null as any,
      dueDate: new Date().toISOString().split('T')[0],
      ownerId: 0,
      unitId: 0,
      status: 'PENDING',
      paid: false
    };
    this.searchFlatNumber = '';
    this.selectedUsers = [];
    this.targetType = 'SPECIFIC';
    this.isSaving = false;
    this.showModal = true;
  }

  isUserSelected(member: Member): boolean {
    return this.selectedUsers.some(u => u.id === member.id);
  }

  toggleUserSelection(member: Member) {
    const index = this.selectedUsers.findIndex(u => u.id === member.id);
    if (index === -1) {
      this.selectedUsers.push(member);
    } else {
      this.selectedUsers.splice(index, 1);
    }
  }

  saveBill() {
    if (!this.newBill.title || !this.newBill.amount || !this.newBill.dueDate) {
      alert('Please fill in Title, Amount, and Due Date.');
      return;
    }

    const targets = this.targetType === 'PUBLIC' ? this.allMembers : this.selectedUsers;
    if (targets.length === 0) {
      alert(this.targetType === 'PUBLIC' ? 'No members found.' : 'Please select at least one resident.');
      return;
    }

    this.isSaving = true;

    const requests = targets.map(user => {
      const billPayload = { ...this.newBill, ownerId: user.id, unitId: user.id };
      return this.billingService.createAddonBill(billPayload);
    });

    forkJoin(requests)
      .pipe(finalize(() => { this.isSaving = false; }))
      .subscribe({
        next: () => {
          this.showModal = false;
          this.loadBills();
        },
        error: () => {
          alert('Some bills could not be created. The list has been refreshed.');
          this.showModal = false;
          this.loadBills();
        }
      });
  }

  deleteBill(id: number) {
    if(confirm('Delete this add-on bill?')) {
      this.billingService.deleteAddonBill(id).subscribe(() => this.loadBills());
    }
  }
}
