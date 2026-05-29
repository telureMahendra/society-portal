import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NoticeService } from '../../core/services/notice.service';
import { NotificationService } from '../../core/services/notification.service';
import { NoticeRequest } from '../../core/models/notice.model';

@Component({
  selector: 'app-notice-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="create-notice-container animate-up">
      <header class="page-header">
        <div class="header-content">
          <button class="back-btn" routerLink="/notices"><i class="fas fa-arrow-left"></i> Back to Notices</button>
          <h1>Create <span>Notice</span></h1>
          <p>Draft and publish a new announcement for the society</p>
        </div>
      </header>

      <div class="form-card glass-card">
        <form [formGroup]="noticeForm" (ngSubmit)="onSubmit()">
          
          <div class="form-row">
            <div class="form-group full-width">
              <label for="title">Notice Title <span class="required">*</span></label>
              <input type="text" id="title" formControlName="title" placeholder="E.g. Annual General Meeting 2024">
              <div class="error-msg" *ngIf="submitted && f['title'].errors?.['required']">Title is required</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="category">Category <span class="required">*</span></label>
              <select id="category" formControlName="category">
                <option value="" disabled>Select Category</option>
                <option value="GENERAL">General</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="EVENT">Event</option>
                <option value="SECURITY">Security</option>
                <option value="GOVERNMENT">Government</option>
              </select>
              <div class="error-msg" *ngIf="submitted && f['category'].errors?.['required']">Category is required</div>
            </div>

            <div class="form-group">
              <label for="priority">Priority <span class="required">*</span></label>
              <select id="priority" formControlName="priority">
                <option value="" disabled>Select Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
              <div class="error-msg" *ngIf="submitted && f['priority'].errors?.['required']">Priority is required</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="visibility">Visibility <span class="required">*</span></label>
              <select id="visibility" formControlName="visibility">
                <option value="PUBLIC">Public (All Residents)</option>
                <option value="WING">Specific Wing</option>
                <option value="FLAT">Specific Flat</option>
              </select>
            </div>
            
            <div class="form-group" *ngIf="f['visibility'].value === 'WING'">
              <label for="targetWing">Target Wing <span class="required">*</span></label>
              <input type="text" id="targetWing" formControlName="targetWing" placeholder="E.g. Wing A">
            </div>

            <div class="form-group" *ngIf="f['visibility'].value === 'FLAT'">
              <label for="targetFlatNumber">Target Flat Number <span class="required">*</span></label>
              <input type="text" id="targetFlatNumber" formControlName="targetFlatNumber" placeholder="E.g. A-101">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group full-width">
              <label for="content">Notice Content <span class="required">*</span></label>
              <textarea id="content" formControlName="content" rows="6" placeholder="Write the full notice details here..."></textarea>
              <div class="error-msg" *ngIf="submitted && f['content'].errors?.['required']">Content is required</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group full-width">
              <label>Attachment (Optional)</label>
              <div class="file-upload-container" [class.has-file]="selectedFile">
                <input type="file" id="attachment" (change)="onFileSelected($event)" accept=".pdf,.png,.jpg,.jpeg,.webp" class="file-input">
                <div class="upload-placeholder" *ngIf="!selectedFile">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Click to upload or drag and drop</p>
                  <span>PDF, PNG, JPG up to 10MB</span>
                </div>
                <div class="file-info" *ngIf="selectedFile">
                  <i class="fas fa-file-alt"></i>
                  <span class="filename">{{ selectedFile.name }}</span>
                  <button type="button" class="remove-btn" (click)="removeFile()"><i class="fas fa-times"></i></button>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" routerLink="/notices">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="isSubmitting">
              <i class="fas fa-spinner fa-spin" *ngIf="isSubmitting"></i> 
              {{ isSubmitting ? 'Publishing...' : 'Publish Notice' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .create-notice-container { max-width: 1000px; margin: 0 auto; padding-bottom: 3rem; }
    
    .page-header {
      margin-bottom: 2rem;
      .back-btn { background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; padding: 0; margin-bottom: 1rem; transition: color 0.2s; &:hover { color: #2563eb; } }
      h1 { font-size: 2.25rem; font-weight: 800; margin: 0; letter-spacing: -0.02em; span { color: var(--primary-color, #2563eb); } }
      p { color: #64748b; margin: 0.5rem 0 0 0; font-size: 1.1rem; }
    }

    .form-card { padding: 3rem; border-radius: 1.25rem; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.5); box-shadow: 0 4px 20px rgba(0,0,0,0.05); }

    .form-row { display: flex; gap: 2rem; margin-bottom: 1.5rem; @media (max-width: 768px) { flex-direction: column; gap: 1.5rem; } }
    .form-group { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
    .full-width { flex: 1 1 100%; }
    
    label { font-weight: 600; color: #1e293b; font-size: 0.95rem; .required { color: #ef4444; } }
    
    input[type="text"], input[type="date"], select, textarea {
      padding: 0.75rem 1rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; font-size: 1rem; color: #1e293b; background: white; transition: all 0.2s; font-family: inherit;
      &:focus { border-color: var(--primary-color, #2563eb); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); outline: none; }
    }
    textarea { resize: vertical; min-height: 120px; }

    .error-msg { color: #ef4444; font-size: 0.85rem; margin-top: 0.25rem; }

    .file-upload-container {
      position: relative; border: 2px dashed #cbd5e1; border-radius: 1rem; padding: 2rem; text-align: center; transition: all 0.2s; background: #f8fafc;
      &:hover { border-color: #94a3b8; background: #f1f5f9; }
      &.has-file { border-style: solid; border-color: #2563eb; background: #eff6ff; padding: 1.5rem; }
      
      .file-input { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
      
      .upload-placeholder {
        i { font-size: 2.5rem; color: #94a3b8; margin-bottom: 1rem; }
        p { font-weight: 600; color: #475569; margin: 0 0 0.25rem 0; }
        span { font-size: 0.85rem; color: #94a3b8; }
      }
      
      .file-info {
        display: flex; align-items: center; justify-content: center; gap: 1rem; z-index: 10; position: relative;
        i { font-size: 1.5rem; color: #2563eb; }
        .filename { font-weight: 600; color: #1e293b; }
        .remove-btn { background: #fee2e2; border: none; color: #ef4444; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; &:hover { background: #fecaca; } }
      }
    }

    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #e2e8f0; }
    
    .btn {
      padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem; border: none; cursor: pointer; transition: all 0.2s; font-size: 1rem; min-width: 120px;
      &.btn-primary { background: #2563eb; color: white; &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); } }
      &.btn-outline { background: white; border: 1px solid #e2e8f0; color: #1e293b; &:hover { background: #f8fafc; } }
      &:disabled { opacity: 0.7; cursor: not-allowed; }
    }

    .animate-up { animation: fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class NoticeCreateComponent implements OnInit {
  noticeForm!: FormGroup;
  submitted = false;
  isSubmitting = false;
  selectedFile: File | null = null;
  uploadedAttachmentData: any = null;

  constructor(
    private fb: FormBuilder,
    private noticeService: NoticeService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.noticeForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      category: ['', Validators.required],
      priority: ['', Validators.required],
      visibility: ['PUBLIC', Validators.required],
      targetWing: [''],
      targetFlatNumber: ['']
    });
  }

  get f() { return this.noticeForm.controls; }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.notificationService.error('Invalid file type. Only PDF and Images are allowed.');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.notificationService.error('File size exceeds 10MB limit.');
        return;
      }
      
      this.selectedFile = file;
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.uploadedAttachmentData = null;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.noticeForm.invalid) {
      return;
    }

    const visibility = this.f['visibility'].value;
    if (visibility === 'WING' && !this.f['targetWing'].value) {
      this.notificationService.error('Target Wing is required for Wing visibility');
      return;
    }
    if (visibility === 'FLAT' && !this.f['targetFlatNumber'].value) {
      this.notificationService.error('Target Flat is required for Flat visibility');
      return;
    }

    this.isSubmitting = true;

    if (this.selectedFile) {
      this.noticeService.uploadAttachment(this.selectedFile).subscribe({
        next: (data) => {
          this.uploadedAttachmentData = data;
          this.saveNotice();
        },
        error: () => {
          this.notificationService.error('Failed to upload attachment');
          this.isSubmitting = false;
        }
      });
    } else {
      this.saveNotice();
    }
  }

  private saveNotice(): void {
    const request: NoticeRequest = {
      title: this.f['title'].value,
      content: this.f['content'].value,
      category: this.f['category'].value,
      priority: this.f['priority'].value,
      visibility: this.f['visibility'].value,
      targetWing: this.f['targetWing'].value,
      targetFlatNumber: this.f['targetFlatNumber'].value,
      active: true,
      isPublic: this.f['visibility'].value === 'PUBLIC'
    };

    if (this.uploadedAttachmentData) {
      request.attachmentUrl = this.uploadedAttachmentData.attachmentUrl;
      request.attachmentName = this.uploadedAttachmentData.attachmentName;
      request.attachmentType = this.uploadedAttachmentData.attachmentType;
    }

    this.noticeService.createNotice(request).subscribe({
      next: () => {
        this.notificationService.success('Notice created successfully');
        this.router.navigate(['/notices']);
      },
      error: () => {
        this.notificationService.error('Failed to create notice');
        this.isSubmitting = false;
      }
    });
  }
}
