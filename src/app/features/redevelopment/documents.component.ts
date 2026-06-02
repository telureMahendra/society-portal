import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ProjectDocument {
  id: string;
  name: string;
  category: string;
  status: 'Approved' | 'Reviewing' | 'Draft' | 'Finalized' | 'Pending Review' | 'Archived';
  modified: string;
  size: string;
  uploader: string;
  version: string;
  fileUrl?: string;
}

@Component({
  selector: 'app-redevelopment-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="documents-container">
    <div class="page-header">
      <div>
        <p class="subtitle-label">Project Management</p>
        <h1>Documents</h1>
        <p class="subtitle">Manage all redevelopment project documentation, plans, and regulatory approvals.</p>
      </div>
      <button class="primary-button" (click)="isAddOpen = true">
        <i class="fas fa-plus"></i>
        Upload Document
      </button>
    </div>

    <div class="controls-section">
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="Search documents..." [(ngModel)]="searchQuery" />
      </div>
      <div class="filter-tabs">
        <button 
          *ngFor="let filter of filterList"
          [class.active]="activeFilter === filter"
          (click)="activeFilter = filter"
          class="filter-tab">
          {{ filter }}
        </button>
      </div>
    </div>

    <section class="documents-table" *ngIf="filteredDocs.length > 0; else emptyState">
      <div class="table-header">
        <div class="col-name">Document Name</div>
        <div class="col-category">Category</div>
        <div class="col-status">Status</div>
        <div class="col-modified">Modified</div>
        <div class="col-uploader">Uploader</div>
        <div class="col-action">Actions</div>
      </div>
      <div class="table-row" *ngFor="let doc of filteredDocs">
        <div class="col-name">
          <i class="fas fa-file-pdf"></i>
          {{ doc.name }}
          <span class="version">{{ doc.version }}</span>
        </div>
        <div class="col-category">
          <span class="badge category">{{ doc.category }}</span>
        </div>
        <div class="col-status">
          <span class="status-badge" [ngClass]="doc.status.toLowerCase()">{{ doc.status }}</span>
        </div>
        <div class="col-modified">{{ doc.modified }}</div>
        <div class="col-uploader">{{ doc.uploader }}</div>
        <div class="col-action">
          <button class="action-button view-button" (click)="viewDoc(doc)" type="button" title="View">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-button download-button" (click)="downloadDoc(doc)" type="button" title="Download">
            <i class="fas fa-download"></i>
          </button>
          <button class="action-button delete-button" (click)="removeDoc(doc.id)" type="button" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </section>

    <ng-template #emptyState>
      <div class="empty-state">
        <i class="fas fa-file-alt"></i>
        <p>No documents found. Upload documents to get started.</p>
      </div>
    </ng-template>

    <!-- Upload Modal -->
    <div class="modal-backdrop" *ngIf="isAddOpen" (click)="isAddOpen = false">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Upload Document</h2>
          <button class="close-button" (click)="isAddOpen = false">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form (ngSubmit)="addDocument()" class="modal-form">
          <!-- File Upload Drag & Drop Area -->
          <div class="form-section">
            <label>
              <span>Select or Drag & Drop File</span>
              <div 
                class="file-upload-area"
                [class.dragging]="isDragging"
                (dragover)="handleDragOver($event)"
                (dragleave)="handleDragLeave()"
                (drop)="handleDrop($event)">
                <i class="fas fa-cloud-upload-alt"></i>
                <p class="upload-text">Drag and drop your file here, or click to select</p>
                <input 
                  #fileInput
                  type="file" 
                  (change)="handleFileSelect($event)"
                  class="file-input"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.zip" />
              </div>
              <p class="file-info" *ngIf="selectedFileName">Selected: <strong>{{ selectedFileName }}</strong> ({{ selectedFileSize }})</p>
            </label>
          </div>

          <div class="form-grid">
            <label>
              <span>Document Name</span>
              <input type="text" required [(ngModel)]="docName" name="docName" placeholder="e.g. Architectural_Plan_Phase1.pdf" />
            </label>

            <label>
              <span>Category</span>
              <select [(ngModel)]="category" name="category">
                <option value="Engineering">Engineering</option>
                <option value="Legal">Legal</option>
                <option value="Survey">Survey</option>
                <option value="Financial">Financial</option>
                <option value="Field Data">Field Data</option>
              </select>
            </label>

            <label>
              <span>Status</span>
              <select [(ngModel)]="status" name="status">
                <option value="Approved">Approved</option>
                <option value="Reviewing">Reviewing</option>
                <option value="Draft">Draft</option>
                <option value="Finalized">Finalized</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Archived">Archived</option>
              </select>
            </label>

            <label>
              <span>File Size</span>
              <input type="text" [(ngModel)]="fileSize" name="fileSize" placeholder="e.g. 4.5 MB" disabled />
            </label>
          </div>

          <div class="modal-actions">
            <button type="button" class="secondary-button" (click)="isAddOpen = false">Cancel</button>
            <button type="submit" class="primary-button">Upload</button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Document Modal -->
    <div class="modal-backdrop" *ngIf="isViewOpen" (click)="isViewOpen = false">
      <div class="view-modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ selectedDoc?.name }}</h2>
          <button class="close-button" (click)="isViewOpen = false">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="view-modal-body">
          <div class="doc-info-grid">
            <div class="info-item">
              <span class="info-label">Category:</span>
              <span class="info-value">{{ selectedDoc?.category }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status:</span>
              <span class="info-value" [ngClass]="selectedDoc?.status?.toLowerCase()">{{ selectedDoc?.status }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Size:</span>
              <span class="info-value">{{ selectedDoc?.size }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Version:</span>
              <span class="info-value">{{ selectedDoc?.version }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Uploaded by:</span>
              <span class="info-value">{{ selectedDoc?.uploader }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Last Modified:</span>
              <span class="info-value">{{ selectedDoc?.modified }}</span>
            </div>
          </div>

          <div class="doc-preview">
            <i class="fas fa-file-pdf"></i>
            <p>{{ selectedDoc?.name }}</p>
            <p class="preview-hint">Document preview not available in browser. Click download to open in your application.</p>
          </div>

          <div class="view-modal-actions">
            <button class="secondary-button" (click)="downloadDoc(selectedDoc!)">
              <i class="fas fa-download"></i>
              Download
            </button>
            <button class="primary-button" (click)="isViewOpen = false">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .documents-container {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
      padding-bottom: 2rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.5rem;
    }

    .subtitle-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #2563eb;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin: 0 0 0.5rem;
    }

    h1 {
      margin: 0 0 0.5rem;
      font-size: 2rem;
      font-weight: 700;
      color: #0f172a;
    }

    .subtitle {
      margin: 0;
      color: #64748b;
      font-size: 0.95rem;
    }

    .primary-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #2563eb;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    }

    .primary-button:hover {
      background: #1d4ed8;
    }

    .secondary-button {
      background: #f1f5f9;
      color: #334155;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .secondary-button:hover {
      background: #e2e8f0;
    }

    .controls-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .search-bar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 0.75rem;
      padding: 0.75rem 1rem;
    }

    .search-bar input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
    }

    .filter-tabs {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
    }

    .filter-tab {
      padding: 0.5rem 1rem;
      border: 1px solid #e2e8f0;
      background: white;
      border-radius: 0.5rem;
      cursor: pointer;
      white-space: nowrap;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }

    .filter-tab.active {
      background: #2563eb;
      color: white;
      border-color: #2563eb;
    }

    .documents-table {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 1rem;
      overflow: hidden;
    }

    .table-header {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 0.8fr;
      gap: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      font-weight: 600;
      color: #475569;
      font-size: 0.85rem;
    }

    .table-row {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 0.8fr;
      gap: 1rem;
      padding: 1rem;
      border-bottom: 1px solid #e2e8f0;
      align-items: center;
      font-size: 0.9rem;
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .col-name {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #0f172a;
      font-weight: 500;
    }

    .col-name i {
      color: #ef4444;
    }

    .version {
      color: #94a3b8;
      font-size: 0.8rem;
      margin-left: auto;
    }

    .badge {
      display: inline-block;
      padding: 0.35rem 0.75rem;
      border-radius: 0.35rem;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .badge.category {
      background: #e0f2fe;
      color: #0284c7;
    }

    .status-badge {
      display: inline-block;
      padding: 0.35rem 0.75rem;
      border-radius: 0.35rem;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .status-badge.approved {
      background: #dcfce7;
      color: #16a34a;
    }

    .status-badge.reviewing {
      background: #fef9c3;
      color: #ca8a04;
    }

    .status-badge.draft {
      background: #f3e8ff;
      color: #9333ea;
    }

    .col-action {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
    }

    .action-button {
      background: transparent;
      border: none;
      cursor: pointer;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
    }

    .view-button {
      color: #0284c7;
    }

    .view-button:hover {
      background: #e0f2fe;
      color: #0c63e4;
    }

    .delete-button {
      color: #94a3b8;
    }

    .delete-button:hover {
      background: #fee2e2;
      color: #dc2626;
    }

    .empty-state {
      padding: 3rem;
      text-align: center;
      color: #64748b;
    }

    .empty-state i {
      font-size: 3rem;
      color: #cbd5e1;
      margin-bottom: 1rem;
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 40;
      padding: 1rem;
    }

    .modal-content {
      background: white;
      border-radius: 1rem;
      width: min(100%, 700px);
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
    }

    .view-modal-content {
      background: white;
      border-radius: 1rem;
      width: min(100%, 500px);
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.25rem;
      color: #0f172a;
    }

    .close-button {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 1.25rem;
    }

    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1.5rem;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .form-section > label {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .form-section span {
      font-weight: 600;
      color: #334155;
      font-size: 0.9rem;
    }

    .file-upload-area {
      border: 2px dashed #cbd5e1;
      border-radius: 0.75rem;
      padding: 2rem;
      text-align: center;
      background: #f8fafc;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .file-upload-area:hover {
      border-color: #2563eb;
      background: #eff6ff;
    }

    .file-upload-area.dragging {
      border-color: #2563eb;
      background: #dbeafe;
    }

    .file-upload-area i {
      font-size: 2.5rem;
      color: #2563eb;
      margin-bottom: 0.5rem;
    }

    .upload-text {
      margin: 0.5rem 0 0;
      color: #64748b;
      font-size: 0.9rem;
    }

    .file-input {
      display: none;
    }

    .file-info {
      margin: 0.5rem 0 0;
      color: #475569;
      font-size: 0.85rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-grid label {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-grid span {
      font-weight: 600;
      color: #334155;
      font-size: 0.9rem;
    }

    .modal-form input,
    .modal-form select {
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      font-size: 0.95rem;
      color: #0f172a;
    }

    .modal-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .view-modal-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .doc-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .info-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
    }

    .info-value {
      color: #0f172a;
      font-weight: 500;
    }

    .doc-preview {
      background: #f8fafc;
      border: 2px dashed #cbd5e1;
      border-radius: 0.75rem;
      padding: 2rem;
      text-align: center;
    }

    .doc-preview i {
      font-size: 2.5rem;
      color: #ef4444;
    }

    .doc-preview p {
      margin: 0.5rem 0 0;
      color: #64748b;
    }

    .preview-hint {
      font-size: 0.8rem;
      color: #94a3b8;
    }

    .view-modal-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }
  `]
})
export class RedevelopmentDocumentsComponent {
  isAddOpen = false;
  isViewOpen = false;
  searchQuery = '';
  docName = '';
  category = 'Engineering';
  status: 'Approved' | 'Reviewing' | 'Draft' | 'Finalized' | 'Pending Review' | 'Archived' = 'Approved';
  fileSize = '';
  activeFilter = 'All Files';
  isDragging = false;
  selectedFileName = '';
  selectedFileSize = '';
  selectedDoc: ProjectDocument | null = null;

  filterList = ['All Files', 'Engineering', 'Legal', 'Survey', 'Financial', 'Field Data'];

  documents: ProjectDocument[] = [
    {
      id: 'doc1',
      name: 'Architectural_Plan_Phase1.pdf',
      category: 'Engineering',
      status: 'Approved',
      modified: '2 hours ago',
      size: '24.5 MB',
      uploader: 'J. Doe',
      version: 'v2.4',
      fileUrl: '/assets/sample.pdf'
    },
    {
      id: 'doc2',
      name: 'Contract_Revision_A12.docx',
      category: 'Legal',
      status: 'Reviewing',
      modified: 'Oct 12, 2023',
      size: '1.2 MB',
      uploader: 'S. Smith',
      version: 'v1.0'
    },
    {
      id: 'doc3',
      name: 'Structural_Analysis_Final.xlsx',
      category: 'Engineering',
      status: 'Approved',
      modified: 'Oct 10, 2023',
      size: '4.5 MB',
      uploader: 'K. Chen',
      version: 'v4.1'
    }
  ];

  get filteredDocs(): ProjectDocument[] {
    let filtered = this.documents;
    
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(query) ||
        d.category.toLowerCase().includes(query) ||
        d.uploader.toLowerCase().includes(query)
      );
    }

    if (this.activeFilter !== 'All Files') {
      filtered = filtered.filter(d => d.category === this.activeFilter);
    }

    return filtered;
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  handleDragLeave() {
    this.isDragging = false;
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files?.[0]) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.processFile(input.files[0]);
    }
  }

  processFile(file: File) {
    this.selectedFileName = file.name;
    this.selectedFileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    this.docName = file.name;
    this.fileSize = this.selectedFileSize;
  }

  addDocument() {
    if (!this.docName.trim()) return;

    this.documents.unshift({
      id: `doc_${Date.now()}`,
      name: this.docName,
      category: this.category,
      status: this.status,
      modified: 'Just now',
      size: this.fileSize || '2.5 MB',
      uploader: 'You',
      version: 'v1.0'
    });

    this.docName = '';
    this.selectedFileName = '';
    this.selectedFileSize = '';
    this.fileSize = '';
    this.isAddOpen = false;
  }

  viewDoc(doc: ProjectDocument) {
    if (doc.fileUrl && !doc.fileUrl.startsWith('data:')) {
      window.open(doc.fileUrl, '_blank');
      return;
    }

    const extension = doc.name.split('.').pop()?.toLowerCase();
    let mimeType = 'application/octet-stream';

    if (extension === 'pdf') {
      mimeType = 'application/pdf';
    } else if (extension === 'docx' || extension === 'doc') {
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (extension === 'xlsx' || extension === 'xls') {
      mimeType = 'application/vnd.ms-excel';
    } else if (['jpg', 'jpeg'].includes(extension || '')) {
      mimeType = 'image/jpeg';
    } else if (extension === 'png') {
      mimeType = 'image/png';
    }

    const content = `This is a sample ${extension?.toUpperCase() || 'document'} file.\n\nFile: ${doc.name}\nCategory: ${doc.category}\nStatus: ${doc.status}\nUploader: ${doc.uploader}`;
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  downloadDoc(doc: ProjectDocument) {
    // If there's a real fileUrl, download from there
    if (doc.fileUrl && !doc.fileUrl.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.name;
      link.click();
      return;
    }

    try {
      const extension = doc.name.split('.').pop()?.toLowerCase();
      let mimeType = 'application/octet-stream';

      if (extension === 'pdf') {
        mimeType = 'application/pdf';
      } else if (extension === 'docx' || extension === 'doc') {
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } else if (extension === 'xlsx' || extension === 'xls') {
        mimeType = 'application/vnd.ms-excel';
      } else if (['jpg', 'jpeg'].includes(extension || '')) {
        mimeType = 'image/jpeg';
      } else if (extension === 'png') {
        mimeType = 'image/png';
      }

      const content = `This is a sample ${extension?.toUpperCase() || 'document'} file.\n\nFile: ${doc.name}\nCategory: ${doc.category}\nStatus: ${doc.status}\nUploader: ${doc.uploader}`;
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Unable to download document. Please try again.');
    }
  }

  removeDoc(id: string) {
    this.documents = this.documents.filter(d => d.id !== id);
  }
}
