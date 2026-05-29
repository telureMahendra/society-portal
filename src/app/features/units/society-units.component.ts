import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocietyStructureService } from '../../core/services/society-structure.service';
import { Wing, Flat } from '../../core/models/society-structure.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-society-units',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="units-container animate-up">
      <header class="page-header">
        <div class="header-content">
          <h1>Society <span>Structure</span></h1>
          <p>Manage buildings, wings, and individual units</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" (click)="openBulkUploadModal()"><i class="fas fa-file-excel"></i> Bulk Upload</button>
          <button class="btn btn-primary" (click)="openAddWingModal()"><i class="fas fa-plus"></i> Add New Wing</button>
        </div>
      </header>

      <!-- Stats Bar -->
      <div class="stats-bar glass-card">
        <div class="stat-item">
          <span class="label">Total Wings</span>
          <span class="value">{{ wings.length }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="label">Total Units</span>
          <span class="value">{{ totalUnits }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="label">Occupancy</span>
          <span class="value success">{{ occupancyPercentage }}%</span>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="units-layout">
        <!-- Wings Sidebar -->
        <div class="wings-list glass-card">
          <h3>Wings / Buildings</h3>
          <div class="wing-items">
            <div 
              *ngFor="let wing of wings" 
              (click)="selectWing(wing)"
              [class.active]="selectedWing?.id === wing.id"
              class="wing-item">
              <div class="wing-icon"><i class="fas fa-building"></i></div>
              <div class="wing-info">
                <strong>{{ wing.name }}</strong>
                <span>{{ wing.totalFlats }} Units</span>
              </div>
              <i class="fas fa-chevron-right arrow"></i>
            </div>
          </div>
        </div>

        <!-- Units Display -->
        <div class="flats-display" *ngIf="selectedWing">
          <div class="display-header">
            <h2>{{ selectedWing.name }} <span>Units</span></h2>
            <div class="view-controls">
              <div class="view-toggle">
                <button [class.active]="viewMode === 'grid'" (click)="viewMode = 'grid'"><i class="fas fa-th-large"></i></button>
                <button [class.active]="viewMode === 'table'" (click)="viewMode = 'table'"><i class="fas fa-list"></i></button>
              </div>
              <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="onSearchChange($event)" placeholder="Search flat or owner...">
              </div>
            </div>
          </div>

          <div class="flats-grid" *ngIf="viewMode === 'grid'">
            <div *ngFor="let flat of displayedFlats" class="flat-card glass-card">
              <div class="flat-header">
                <span class="flat-number">{{ selectedWing.name.split(' ')[1] }}-{{ flat.flatNumber }}</span>
                <span class="status-badge" [class]="flat.occupancyStatus.toLowerCase()">
                  {{ flat.occupancyStatus }}
                </span>
              </div>
              
              <div class="flat-body">
                <div class="info-row">
                  <i class="fas fa-user"></i>
                  <div class="info">
                    <span class="label">Resident/Owner</span>
                    <strong>{{ flat.ownerName }}</strong>
                  </div>
                </div>
                <div class="info-row">
                  <i class="fas fa-id-badge"></i>
                  <div class="info">
                    <span class="label">Type</span>
                    <strong>{{ flat.residentType }}</strong>
                  </div>
                </div>
                <div class="info-row">
                  <i class="fas fa-expand-arrows-alt"></i>
                  <div class="info">
                    <span class="label">Area</span>
                    <strong>{{ flat.areaSqFt }} Sq Ft</strong>
                  </div>
                </div>
              </div>

              <div class="flat-footer">
                <button class="btn-icon" (click)="openOwnerModal(flat)" title="Manage Owner"><i class="fas fa-user-edit"></i></button>
                <button class="btn-icon" title="View History"><i class="fas fa-history"></i></button>
                <button class="btn-icon" title="Manage Billing"><i class="fas fa-file-invoice-dollar"></i></button>
              </div>
            </div>
          </div>

          
          <div class="flats-table-container glass-card" *ngIf="viewMode === 'table'">
            <table class="flats-table">
              <thead>
                <tr>
                  <th>Unit</th>
                  <th>Status</th>
                  <th>Resident/Owner</th>
                  <th>Type</th>
                  <th>Area</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let flat of displayedFlats">
                  <td><strong>{{ selectedWing.name.split(' ')[1] }}-{{ flat.flatNumber }}</strong></td>
                  <td><span class="status-badge" [class]="flat.occupancyStatus.toLowerCase()">{{ flat.occupancyStatus }}</span></td>
                  <td>{{ flat.ownerName }}</td>
                  <td>{{ flat.residentType }}</td>
                  <td>{{ flat.areaSqFt }} Sq Ft</td>
                  <td class="table-actions">
                    <button class="btn-icon-small" (click)="openOwnerModal(flat)" title="Manage Owner"><i class="fas fa-user-edit"></i></button>
                    <button class="btn-icon-small" title="View History"><i class="fas fa-history"></i></button>
                    <button class="btn-icon-small" title="Manage Billing"><i class="fas fa-file-invoice-dollar"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div *ngIf="displayedFlats.length === 0" class="empty-state">
            <i class="fas fa-search"></i>
            <p>No flats found matching your search.</p>
          </div>

          <div class="pagination-controls glass-card" *ngIf="totalElements > 0">
            <div class="page-info">
              Showing {{ currentPage * pageSize + 1 }} to {{ min((currentPage + 1) * pageSize, totalElements) }} of {{ totalElements }} entries
            </div>
            <div class="page-actions">
              <select [(ngModel)]="pageSize" (change)="onPageSizeChange()">
                <option *ngFor="let size of pageSizes" [value]="size">{{ size }} / page</option>
              </select>
              <button class="btn btn-outline" [disabled]="currentPage === 0" (click)="onPageChange(currentPage - 1)"><i class="fas fa-chevron-left"></i></button>
              <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
              <button class="btn btn-outline" [disabled]="currentPage >= totalPages - 1" (click)="onPageChange(currentPage + 1)"><i class="fas fa-chevron-right"></i></button>
            </div>
          </div>

        </div>
      </div>

      <!-- Add New Wing Modal -->
      <div class="modal-overlay" *ngIf="showAddWingModal" (click)="closeAddWingModal()">
        <div class="modal-content glass-card animate-up" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Add New <span>Wing</span></h2>
            <button class="close-btn" (click)="closeAddWingModal()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Wing Name</label>
              <input type="text" [(ngModel)]="newWingForm.name" placeholder="e.g. Wing C" />
            </div>
            <div class="form-group">
              <label>Total Floors</label>
              <input type="number" [(ngModel)]="newWingForm.totalFloors" placeholder="e.g. 10" />
            </div>
            <div class="form-group">
              <label>Flats Per Floor</label>
              <input type="number" [(ngModel)]="newWingForm.flatsPerFloor" placeholder="e.g. 4" />
            </div>
            <div class="modal-actions">
              <button class="btn btn-outline" (click)="closeAddWingModal()">Cancel</button>
              <button class="btn btn-primary" (click)="saveNewWing()" [disabled]="!newWingForm.name || !newWingForm.totalFloors || !newWingForm.flatsPerFloor">
                <i class="fas fa-save"></i> Save Wing
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Manage Owner Modal -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-content glass-card animate-up" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Manage Owner / <span>Resident</span></h2>
            <button class="close-btn" (click)="closeModal()">&times;</button>
          </div>
          
          <div class="modal-body" *ngIf="editingFlat">
            <div class="flat-summary">
              <strong>Flat {{ editingFlat.flatNumber }}</strong>
              <span>{{ selectedWing?.name }}</span>
            </div>

            <form (ngSubmit)="saveOwner()">
              <div class="form-group">
                <label>Owner/Resident Name</label>
                <input type="text" [(ngModel)]="ownerForm.name" name="ownerName" placeholder="Enter full name" required>
              </div>

              <div class="form-group">
                <label>Resident Type</label>
                <select [(ngModel)]="ownerForm.type" name="residentType">
                  <option value="OWNER">Owner</option>
                  <option value="TENANT">Tenant</option>
                </select>
              </div>

              <div class="modal-actions">
                <button type="button" class="btn btn-outline" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Bulk Upload Modal -->
      <div class="modal-overlay" *ngIf="showBulkModal" (click)="closeBulkModal()">
        <div class="modal-content glass-card animate-up" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Bulk Upload <span>Units</span></h2>
            <button class="close-btn" (click)="closeBulkModal()">&times;</button>
          </div>

          <div class="modal-body">
            <div class="upload-zone" *ngIf="!isUploading && !uploadComplete">
              <i class="fas fa-cloud-upload-alt"></i>
              <h3>Drag and drop Excel sheet</h3>
              <p>or click to browse from your computer</p>
              <input type="file" #fileInput (change)="onFileSelected($event)" hidden accept=".xlsx, .xls">
              <button class="btn btn-outline" (click)="fileInput.click()">Select File</button>
              <div class="sample-link">
                <a href="/society_units_template.csv" download><i class="fas fa-download"></i> Download sample template</a>
              </div>
            </div>

            <div class="processing-zone" *ngIf="isUploading">
              <div class="spinner"></div>
              <h3>Processing Data...</h3>
              <p>Please wait while we validate and import your records.</p>
              <div class="progress-container">
                <div class="progress-bar" [style.width.%]="uploadProgress"></div>
              </div>
              <span class="progress-text">{{ uploadProgress }}% Complete</span>
            </div>

            <div class="success-zone" *ngIf="uploadComplete">
              <div class="success-icon"><i class="fas fa-check-circle"></i></div>
              <h3>Upload Successful!</h3>
              <p>Successfully imported 124 units and owner records.</p>
              <button class="btn btn-primary" (click)="closeBulkModal()">Done</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .units-container { max-width: 1400px; margin: 0 auto; }
    
    .page-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
      h1 { font-size: 2.25rem; font-weight: 800; margin: 0; letter-spacing: -0.02em; span { color: var(--primary-color, #2563eb); } }
      p { color: #64748b; margin: 0.5rem 0 0 0; }
    }

    .stats-bar {
      display: flex; justify-content: space-around; align-items: center; padding: 1.5rem !important; margin-bottom: 2rem;
      .stat-item {
        text-align: center;
        .label { display: block; font-size: 0.875rem; color: #64748b; margin-bottom: 0.25rem; font-weight: 600; text-transform: uppercase; }
        .value { font-size: 1.5rem; font-weight: 800; color: #1e293b; }
        .value.success { color: #10b981; }
      }
      .stat-divider { width: 1px; height: 40px; background: #e2e8f0; }
    }

    .units-layout {
      display: grid; grid-template-columns: 320px 1fr; gap: 2rem;
      @media (max-width: 1024px) { grid-template-columns: 1fr; }
    }

    .wings-list {
      height: fit-content; h3 { margin-top: 0; margin-bottom: 1.5rem; font-size: 1.1rem; color: #1e293b; }
    }

    .wing-item {
      display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: 0.75rem; cursor: pointer;
      transition: all 0.2s; border: 1px solid transparent; margin-bottom: 0.5rem;

      &:hover { background: #f8fafc; border-color: #e2e8f0; }
      &.active { background: rgba(37, 99, 235, 0.05); border-color: rgba(37, 99, 235, 0.2);
        .wing-icon { background: #2563eb; color: white; }
        strong { color: #2563eb; }
        .arrow { color: #2563eb; transform: translateX(2px); }
      }
    }

    .wing-icon { width: 40px; height: 40px; background: #f1f5f9; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: #64748b; transition: all 0.2s; }
    .wing-info { flex: 1; strong { display: block; color: #1e293b; } span { font-size: 0.8125rem; color: #94a3b8; } }
    .arrow { color: #cbd5e1; font-size: 0.875rem; transition: transform 0.2s; }

    .flats-display {
      .display-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
        h2 { margin: 0; font-size: 1.75rem; font-weight: 800; span { color: #2563eb; } }
      }
    }

    .search-box {
      position: relative; width: 300px;
      i { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
      input { width: 100%; padding: 0.625rem 1rem 0.625rem 2.5rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; outline: none; transition: border-color 0.2s; &:focus { border-color: #2563eb; } }
    }

    .flats-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;
    }

    .flat-card {
      padding: 1.5rem !important; transition: all 0.3s;
      &:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important; }
    }

    .flat-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
      .flat-number { font-size: 1.25rem; font-weight: 800; color: #1e293b; }
    }

    .status-badge {
      padding: 0.25rem 0.625rem; border-radius: 2rem; font-size: 0.7rem; font-weight: 800; text-transform: uppercase;
      &.occupied { background: #dcfce7; color: #166534; }
      &.vacant { background: #f1f5f9; color: #475569; }
    }

    .info-row {
      display: flex; gap: 0.875rem; margin-bottom: 1rem;
      i { color: #94a3b8; font-size: 0.875rem; margin-top: 0.25rem; }
      .label { display: block; font-size: 0.75rem; color: #94a3b8; font-weight: 600; }
      strong { color: #1e293b; font-size: 0.9rem; }
    }

    .flat-footer {
      display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #f1f5f9;
    }

    .btn-icon {
      width: 32px; height: 32px; border-radius: 0.5rem; border: 1px solid #e2e8f0; background: white; color: #64748b; cursor: pointer; transition: all 0.2s;
      &:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
    }

    
    .view-controls { display: flex; gap: 1rem; align-items: center; }
    .view-toggle { display: flex; background: #f1f5f9; padding: 0.25rem; border-radius: 0.5rem; gap: 0.25rem; }
    .view-toggle button { border: none; background: transparent; padding: 0.5rem 0.75rem; border-radius: 0.375rem; cursor: pointer; color: #64748b; transition: all 0.2s; }
    .view-toggle button.active { background: white; color: #2563eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    
    .flats-table-container { overflow-x: auto; border-radius: 1rem; margin-bottom: 1.5rem; }
    .flats-table { width: 100%; border-collapse: collapse; text-align: left; }
    .flats-table th { padding: 1rem 1.5rem; background: #f8fafc; font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0; }
    .flats-table td { padding: 1rem 1.5rem; border-bottom: 1px solid #e2e8f0; color: #1e293b; }
    .flats-table tbody tr:last-child td { border-bottom: none; }
    .flats-table tbody tr:hover { background: #f8fafc; }
    .table-actions { display: flex; gap: 0.5rem; }
    .btn-icon-small { width: 28px; height: 28px; border-radius: 0.375rem; border: 1px solid #e2e8f0; background: white; color: #64748b; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; }
    .btn-icon-small:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }

    /* Modal Styles */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem;
    }
    .modal-content {
      width: 100%; max-width: 500px; padding: 2rem; background: rgba(255, 255, 255, 0.95) !important;
    }
    .modal-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
      h2 { margin: 0; font-size: 1.5rem; font-weight: 800; span { color: #2563eb; } }
      .close-btn { background: none; border: none; font-size: 2rem; color: #94a3b8; cursor: pointer; }
    }

    /* Bulk Upload Styles */
    .upload-zone {
      text-align: center; padding: 3rem 2rem; border: 2px dashed #e2e8f0; border-radius: 1rem;
      i { font-size: 3rem; color: #2563eb; margin-bottom: 1.5rem; display: block; }
      h3 { margin-bottom: 0.5rem; color: #1e293b; }
      p { color: #64748b; margin-bottom: 1.5rem; }
      .sample-link { margin-top: 1.5rem; a { color: #2563eb; text-decoration: none; font-size: 0.875rem; font-weight: 600; &:hover { text-decoration: underline; } } }
    }

    .processing-zone {
      text-align: center; padding: 2rem;
      h3 { margin: 1rem 0; }
      .progress-container { width: 100%; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; margin: 1.5rem 0; }
      .progress-bar { height: 100%; background: #2563eb; transition: width 0.3s; }
      .progress-text { font-size: 0.875rem; font-weight: 700; color: #2563eb; }
    }

    .success-zone {
      text-align: center; padding: 2rem;
      .success-icon { font-size: 4rem; color: #10b981; margin-bottom: 1.5rem; }
      h3 { margin-bottom: 0.5rem; }
      p { margin-bottom: 2rem; color: #64748b; }
      button { width: 100%; }
    }

    .spinner {
      width: 40px; height: 40px; border: 4px solid #f1f5f9; border-top-color: #2563eb; border-radius: 50%;
      margin: 0 auto; animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .pagination-controls { display: flex; justify-content: space-between; align-items: center; padding: 1rem; margin-top: 1.5rem; border-radius: 0.75rem; }
    .page-actions { display: flex; align-items: center; gap: 1rem; }
    .page-actions select { padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; outline: none; }
    .page-actions button { padding: 0.5rem 1rem; }
    .flat-summary {
      background: #f1f5f9; padding: 1rem; border-radius: 0.75rem; margin-bottom: 2rem;
      strong { display: block; font-size: 1.1rem; color: #1e293b; }
      span { color: #64748b; font-size: 0.875rem; }
    }
    .form-group {
      margin-bottom: 1.5rem;
      label { display: block; font-size: 0.875rem; font-weight: 600; color: #475569; margin-bottom: 0.5rem; }
      input, select {
        width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; outline: none; transition: border-color 0.2s;
        &:focus { border-color: #2563eb; }
      }
    }
    .header-actions { display: flex; gap: 1rem; align-items: center; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }

    .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border-radius: 1rem; border: 1px solid rgba(255,255,255,0.5); box-shadow: 0 4px 20px rgba(0,0,0,0.05); }

    .btn { padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; border: none; cursor: pointer; transition: all 0.2s;
      &.btn-primary { background: #2563eb; color: white; &:hover { background: #1d4ed8; } }
      &.btn-outline { background: white; border: 1px solid #e2e8f0; color: #1e293b; &:hover { background: #f8fafc; } }
    }

    .animate-up { animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class SocietyUnitsComponent implements OnInit {
    
    viewMode: 'grid' | 'table' = 'grid';
    wings: Wing[] = [];
    selectedWing: Wing | null = null;
    searchTerm: string = '';
    searchSubject = new Subject<string>();

    displayedFlats: Flat[] = [];
    currentPage = 0;
    pageSize = 10;
    totalElements = 0;
    totalPages = 0;
    pageSizes = [10, 20, 30, 50, 100];

    // Modal State
    showModal = false;
    editingFlat: Flat | null = null;
    ownerForm = {
        name: '',
        type: 'OWNER' as 'OWNER' | 'TENANT'
    };

    // Bulk Upload State
    showBulkModal = false;
    isUploading = false;
    uploadProgress = 0;
    uploadComplete = false;

    // Add Wing State
    showAddWingModal = false;
    newWingForm = {
        name: '',
        totalFloors: null as any,
        flatsPerFloor: null as any
    };

    constructor(private structureService: SocietyStructureService, private cdr: ChangeDetectorRef) { }

    get totalUnits(): number {
        return this.wings.reduce((acc, w) => acc + w.totalFlats, 0);
    }

    ngOnInit(): void {
        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(() => {
            this.currentPage = 0;
            this.loadFlats();
        });

        this.structureService.getWings().subscribe(wings => {
            this.wings = wings;
            if (wings.length > 0) {
                this.selectWing(wings[0]);
            }
            this.cdr.detectChanges();
        });
    }

    selectWing(wing: Wing): void {
        this.selectedWing = wing;
        this.currentPage = 0;
        this.searchTerm = '';
        this.loadFlats();
    }

    loadFlats(): void {
        if (!this.selectedWing) return;
        this.structureService.getFlats(
            this.selectedWing.name,
            this.searchTerm,
            this.currentPage,
            this.pageSize
        ).subscribe((response: any) => {
            if (response && response.content) {
                this.displayedFlats = response.content;
                this.totalElements = response.totalElements;
                this.totalPages = response.totalPages;
                this.currentPage = response.pageNo;
                this.pageSize = response.pageSize;
            } else {
                this.displayedFlats = Array.isArray(response) ? response : [];
                this.totalElements = this.displayedFlats.length;
                this.totalPages = 1;
            }
            this.cdr.detectChanges();
        });
    }

    min(a: number, b: number): number {
        return Math.min(a, b);
    }

    onSearchChange(value: string): void {
        this.searchSubject.next(value);
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadFlats();
    }

    onPageSizeChange(): void {
        this.currentPage = 0;
        this.loadFlats();
    }

    get occupancyPercentage(): number {
        let totalFlats = 0;
        let occupiedFlats = 0;
        this.wings.forEach(w => {
            if (w.flats) {
                totalFlats += w.flats.length;
                occupiedFlats += w.flats.filter(f => f.occupancyStatus === 'OCCUPIED').length;
            }
        });
        return totalFlats > 0 ? Math.round((occupiedFlats / totalFlats) * 100) : 0;
    }

    // Modal Handlers
    openOwnerModal(flat: Flat): void {
        this.editingFlat = flat;
        this.ownerForm = {
            name: flat.ownerName === 'N/A' ? '' : flat.ownerName,
            type: flat.residentType === 'VACANT' ? 'OWNER' : flat.residentType as any
        };
        this.showModal = true;
    }

    closeModal(): void {
        this.showModal = false;
        this.editingFlat = null;
    }

    saveOwner(): void {
        if (this.editingFlat) {
            this.structureService.updateFlatOwner(
                this.editingFlat.id,
                this.ownerForm.name,
                this.ownerForm.type as any
            ).subscribe(success => {
                if (success) {
                    this.closeModal();
                    // Data is updated in mock service which is shared
                }
            });
        }
    }

    // Add Wing Handlers
    openAddWingModal(): void {
        this.newWingForm = { name: '', totalFloors: null as any, flatsPerFloor: null as any };
        this.showAddWingModal = true;
    }

    closeAddWingModal(): void {
        this.showAddWingModal = false;
    }

    saveNewWing(): void {
        if (this.newWingForm.name && this.newWingForm.totalFloors && this.newWingForm.flatsPerFloor) {
            this.structureService.addWing(
                this.newWingForm.name,
                this.newWingForm.totalFloors,
                this.newWingForm.flatsPerFloor
            ).subscribe(newWing => {
                this.closeAddWingModal();
                this.structureService.getWings().subscribe(wings => {
                    this.wings = wings;
                    const created = wings.find(w => w.name === this.newWingForm.name); if (created) { this.selectWing(created); } else if (wings.length > 0) { this.selectWing(wings[wings.length - 1]); }
                    this.cdr.detectChanges();
                });
            });
        }
    }

    // Bulk Upload Handlers
    openBulkUploadModal(): void {
        this.showBulkModal = true;
        this.isUploading = false;
        this.uploadProgress = 0;
        this.uploadComplete = false;
    }

    closeBulkModal(): void {
        this.showBulkModal = false;
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.isUploading = true;
            this.structureService.bulkUploadUnits(file).subscribe({
                next: (progress) => {
                    this.uploadProgress = progress;
                },
                complete: () => {
                    this.isUploading = false;
                    this.uploadComplete = true;
                    // Refresh data
                    this.structureService.getWings().subscribe(wings => this.wings = wings);
                }
            });
        }
    }
}
