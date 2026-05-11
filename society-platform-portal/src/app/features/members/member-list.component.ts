import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Member, MemberType, MemberStatus } from '../../core/models/member.model';
import { MemberService } from '../../core/services/member.service';

@Component({
    selector: 'app-member-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="members-container animate-up">
      <header class="page-header">
        <div class="title-section">
          <h1>Society <span>Members</span></h1>
          <p>Manage residents, owners, and society staff members</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" (click)="openImportModal()"><i class="fas fa-file-import"></i> Import</button>
          <button class="btn btn-primary" (click)="openAddModal()"><i class="fas fa-user-plus"></i> Add Member</button>
        </div>
      </header>

      <!-- Filters & Search -->
      <div class="filters-bar glass-card">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" [(ngModel)]="searchTerm" placeholder="Search by name, email, or mobile...">
        </div>
        
        <div class="filter-group">
          <select [(ngModel)]="selectedType" class="filter-select">
            <option value="ALL">All Member Types</option>
            <option value="OWNER">Owners</option>
            <option value="TENANT">Tenants</option>
            <option value="STAFF">Staff</option>
          </select>

          <select [(ngModel)]="selectedStatus" class="filter-select">
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      <!-- Members Grid/Table -->
      <div class="members-table-container glass-card">
        <table class="members-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Contact Info</th>
              <th>Type & Role</th>
              <th>Unit / Dept</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let member of filteredMembers" class="member-row">
              <td>
                <div class="member-identity">
                  <div class="avatar">
                    <img *ngIf="member.profileImageUrl" [src]="member.profileImageUrl" [alt]="member.firstName">
                    <span *ngIf="!member.profileImageUrl">{{ member.firstName[0] }}{{ member.lastName[0] }}</span>
                  </div>
                  <div class="name-info">
                    <span class="full-name">{{ member.firstName }} {{ member.lastName }}</span>
                    <span class="join-date">Joined {{ member.joinedDate }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="contact-info">
                  <span class="mobile"><i class="fas fa-phone-alt"></i> {{ member.mobile }}</span>
                  <span class="email"><i class="far fa-envelope"></i> {{ member.email }}</span>
                </div>
              </td>
              <td>
                <div class="type-role">
                  <span class="type-badge" [class]="member.type.toLowerCase()">{{ member.type }}</span>
                  <span class="role-label">{{ member.role.replace('_', ' ') }}</span>
                </div>
              </td>
              <td>
                <div class="unit-info" *ngIf="member.unitMapping && member.unitMapping.length > 0">
                  <span class="unit-tag" *ngFor="let u of member.unitMapping">
                    {{ u.wing }} - {{ u.flatNumber }}
                  </span>
                </div>
                <div class="staff-info" *ngIf="member.type === 'STAFF'">
                  <span class="dept-tag">{{ member.staffCategory }}</span>
                </div>
              </td>
              <td>
                <span class="status-badge" [class]="member.status.toLowerCase()">
                  {{ member.status }}
                </span>
              </td>
              <td>
                <div class="actions">
                  <button class="btn-icon" title="Edit"><i class="fas fa-edit"></i></button>
                  <button class="btn-icon danger" (click)="deleteMember(member.id)" title="Remove"><i class="fas fa-trash-alt"></i></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div *ngIf="filteredMembers.length === 0" class="empty-state">
          <i class="fas fa-users-slash"></i>
          <h3>No members found</h3>
          <p>Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      </div>

      <!-- Import Modal -->
      <div class="modal-overlay" *ngIf="showImportModal" (click)="closeImportModal()">
        <div class="modal-content glass-card animate-up" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Import <span>Members</span></h2>
            <button class="close-btn" (click)="closeImportModal()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="upload-zone" *ngIf="!isUploading && !uploadComplete">
              <i class="fas fa-cloud-upload-alt"></i>
              <h3>Upload Member Data</h3>
              <p>Upload a CSV/Excel file containing member details</p>
              <input type="file" #fileInput (change)="handleImport($event)" hidden>
              <button class="btn btn-outline" (click)="fileInput.click()">Select File</button>
            </div>

            <div class="processing-zone" *ngIf="isUploading">
              <div class="spinner"></div>
              <h3>Importing Members...</h3>
              <div class="progress-bar-container">
                <div class="progress-bar" [style.width.%]="uploadProgress"></div>
              </div>
              <span>{{ uploadProgress }}% Complete</span>
            </div>

            <div class="success-zone" *ngIf="uploadComplete">
              <i class="fas fa-check-circle success-icon"></i>
              <h3>Import Complete!</h3>
              <p>Successfully processed 42 member records.</p>
              <button class="btn btn-primary" (click)="closeImportModal()">Done</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .members-container { max-width: 1400px; margin: 0 auto; }

    .page-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
      h1 { font-size: 2.25rem; font-weight: 800; margin: 0; letter-spacing: -0.02em; span { color: #2563eb; } }
      p { color: #64748b; margin: 0.5rem 0 0 0; }
      .header-actions { display: flex; gap: 1rem; }
    }

    .filters-bar {
      display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 2rem !important; margin-bottom: 2rem; gap: 2rem;
      @media (max-width: 768px) { flex-direction: column; align-items: stretch; }
      
      .search-box {
        flex: 1; position: relative;
        i { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        input { width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; outline: none; transition: border-color 0.2s; &:focus { border-color: #2563eb; } }
      }

      .filter-group { display: flex; gap: 1rem; }
      .filter-select { padding: 0.75rem 1.5rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; outline: none; background: white; cursor: pointer; color: #1e293b; font-weight: 500; }
    }

    .members-table-container {
      padding: 0 !important; overflow: hidden;
      .members-table {
        width: 100%; border-collapse: collapse; text-align: left;
        th { padding: 1.25rem 2rem; background: #f8fafc; color: #64748b; font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; }
        td { padding: 1.5rem 2rem; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
      }
    }

    .member-identity {
      display: flex; align-items: center; gap: 1rem;
      .avatar {
        width: 48px; height: 48px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; overflow: hidden;
        img { width: 100%; height: 100%; object-fit: cover; }
      }
      .name-info {
        display: flex; flex-direction: column;
        .full-name { font-weight: 700; color: #1e293b; font-size: 1rem; }
        .join-date { font-size: 0.75rem; color: #94a3b8; }
      }
    }

    .contact-info {
      display: flex; flex-direction: column; gap: 0.25rem;
      span { font-size: 0.875rem; color: #475569; display: flex; align-items: center; gap: 0.5rem; i { width: 14px; color: #94a3b8; } }
    }

    .type-role {
      display: flex; flex-direction: column; gap: 0.375rem;
      .type-badge {
        display: inline-block; padding: 0.25rem 0.625rem; border-radius: 2rem; font-size: 0.65rem; font-weight: 800; width: fit-content; text-transform: uppercase;
        &.owner { background: #dcfce7; color: #166534; }
        &.tenant { background: #eff6ff; color: #1e40af; }
        &.staff { background: #fef3c7; color: #92400e; }
      }
      .role-label { font-size: 0.75rem; color: #94a3b8; font-weight: 500; padding-left: 0.5rem; }
    }

    .unit-info, .staff-info {
      .unit-tag, .dept-tag { display: inline-block; padding: 0.375rem 0.75rem; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 0.5rem; font-size: 0.8125rem; color: #1e293b; font-weight: 600; }
    }

    .status-badge {
      padding: 0.375rem 0.75rem; border-radius: 2rem; font-size: 0.75rem; font-weight: 700;
      &.active { background: #dcfce7; color: #15803d; }
      &.pending { background: #fef3c7; color: #b45309; }
      &.suspended { background: #fee2e2; color: #b91c1c; }
    }

    .actions {
      display: flex; gap: 0.5rem;
      .btn-icon {
        width: 36px; height: 36px; border-radius: 0.625rem; border: 1px solid #e2e8f0; background: white; color: #64748b; cursor: pointer; transition: all 0.2s;
        &:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
        &.danger:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }
      }
    }

    .empty-state { text-align: center; padding: 4rem 2rem; i { font-size: 3rem; color: #e2e8f0; margin-bottom: 1.5rem; } h3 { margin: 0 0 0.5rem 0; color: #1e293b; } p { color: #64748b; margin: 0; } }

    /* Modal Styles */
    .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
    .modal-content { width: 100%; max-width: 500px; padding: 2rem; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; h2 { margin: 0; font-size: 1.5rem; font-weight: 800; span { color: #2563eb; } } .close-btn { background: none; border: none; font-size: 2rem; color: #94a3b8; cursor: pointer; } }

    .upload-zone {
      text-align: center; padding: 3rem 2rem; border: 2px dashed #e2e8f0; border-radius: 1rem;
      i { font-size: 3rem; color: #2563eb; margin-bottom: 1.5rem; display: block; }
      h3 { margin-bottom: 0.5rem; color: #1e293b; }
      p { color: #64748b; margin-bottom: 1.5rem; }
    }

    .processing-zone {
      text-align: center; padding: 2rem;
      .spinner { width: 40px; height: 40px; border: 4px solid #f1f5f9; border-top-color: #2563eb; border-radius: 50%; margin: 0 auto 1.5rem; animation: spin 1s linear infinite; }
      .progress-bar-container { width: 100%; height: 8px; background: #f1f5f9; border-radius: 4px; margin: 1.5rem 0; overflow: hidden; }
      .progress-bar { height: 100%; background: #2563eb; transition: width 0.3s; }
      span { font-size: 0.875rem; font-weight: 700; color: #2563eb; }
    }

    .success-zone { text-align: center; padding: 2rem; .success-icon { font-size: 4rem; color: #10b981; margin-bottom: 1.5rem; } h3 { margin-bottom: 2rem; } button { width: 100%; } }

    @keyframes spin { to { transform: rotate(360deg); } }
    .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border-radius: 1rem; border: 1px solid rgba(255,255,255,0.5); box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .btn { padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem;
      &.btn-primary { background: #2563eb; color: white; &:hover { background: #1d4ed8; } }
      &.btn-outline { background: white; border: 1px solid #e2e8f0; color: #1e293b; &:hover { background: #f8fafc; } }
    }
    .animate-up { animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class MemberListComponent implements OnInit {
    members: Member[] = [];
    searchTerm: string = '';
    selectedType: string = 'ALL';
    selectedStatus: string = 'ALL';

    // Import State
    showImportModal = false;
    isUploading = false;
    uploadProgress = 0;
    uploadComplete = false;

    constructor(private memberService: MemberService) { }

    ngOnInit(): void {
        this.memberService.getMembers().subscribe(data => this.members = data);
    }

    get filteredMembers(): Member[] {
        return this.members.filter(m => {
            const search = this.searchTerm.toLowerCase();
            const nameMatch = `${m.firstName} ${m.lastName}`.toLowerCase().includes(search) ||
                m.email.toLowerCase().includes(search) ||
                m.mobile.includes(search);

            const typeMatch = this.selectedType === 'ALL' || m.type === this.selectedType;
            const statusMatch = this.selectedStatus === 'ALL' || m.status === this.selectedStatus;

            return nameMatch && typeMatch && statusMatch;
        });
    }

    deleteMember(id: number): void {
        if (confirm('Are you sure you want to remove this member?')) {
            this.memberService.deleteMember(id).subscribe(() => {
                this.members = this.members.filter(m => m.id !== id);
            });
        }
    }

    openAddModal(): void {
        // Placeholder for add modal
        alert('Add Member modal will be implemented in the next step.');
    }

    // Import Logic
    openImportModal(): void {
        this.showImportModal = true;
        this.isUploading = false;
        this.uploadProgress = 0;
        this.uploadComplete = false;
    }

    closeImportModal(): void {
        this.showImportModal = false;
    }

    handleImport(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.isUploading = true;
            this.memberService.bulkImportMembers(file).subscribe({
                next: (p) => this.uploadProgress = p,
                complete: () => {
                    this.isUploading = false;
                    this.uploadComplete = true;
                    this.memberService.getMembers().subscribe(data => this.members = data);
                }
            });
        }
    }
}
