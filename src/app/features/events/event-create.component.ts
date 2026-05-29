import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SocietyEventService } from '../../core/services/society-event.service';
import { SocietyEvent } from '../../core/models/society-event.model';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container animate-up">
      <header class="page-header">
        <button class="btn-back" (click)="goBack()">
          <i class="fas fa-arrow-left"></i> Back to Events
        </button>
        <div class="header-content mt-3">
          <h1>Create New <span>Event</span></h1>
          <p>Create and publish a new community event</p>
        </div>
      </header>

      <form (ngSubmit)="submitEvent()" class="event-form glass-card">
        <h3>Event Information</h3>
        
        <div class="form-row">
          <div class="form-group flex-2">
            <label>Event Title *</label>
            <input type="text" [(ngModel)]="newEvent.title" name="title" required class="form-control" />
          </div>
          <div class="form-group flex-1">
            <label>Category *</label>
            <select [(ngModel)]="newEvent.category" name="category" required class="form-control">
              <option value="CULTURAL">Cultural</option>
              <option value="FESTIVAL">Festival</option>
              <option value="SPORTS">Sports</option>
              <option value="MEETING">Meeting</option>
              <option value="CHARITY">Charity</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Description *</label>
          <textarea [(ngModel)]="newEvent.description" name="description" rows="4" required class="form-control"></textarea>
        </div>

        <h3 class="mt-4">Schedule</h3>
        <div class="form-row">
          <div class="form-group">
            <label>Start Date & Time *</label>
            <input type="datetime-local" [(ngModel)]="newEvent.eventDate" name="eventDate" required class="form-control" />
          </div>
          <div class="form-group">
            <label>End Date & Time *</label>
            <input type="datetime-local" [(ngModel)]="newEvent.endDate" name="endDate" required class="form-control" />
          </div>
        </div>

        <h3 class="mt-4">Location</h3>
        <div class="form-group">
          <label>Venue Name *</label>
          <input type="text" [(ngModel)]="newEvent.location" name="location" required class="form-control" />
        </div>

        <h3 class="mt-4">Event Image</h3>
        <div class="form-group">
          <div 
            class="file-drop-zone" 
            [class.drag-over]="isDragging"
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave($event)"
            (drop)="onDrop($event)"
            (click)="fileInput.click()">
            <div class="drop-content" *ngIf="!selectedFile">
              <i class="fas fa-cloud-upload-alt fa-3x"></i>
              <p>Drag & Drop an image here or click to browse</p>
            </div>
            <div class="drop-content selected-file" *ngIf="selectedFile">
              <i class="fas fa-file-image fa-2x"></i>
              <p>{{ selectedFile.name }}</p>
              <button type="button" class="btn-clear" (click)="clearFile($event)"><i class="fas fa-times"></i></button>
            </div>
            <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" style="display: none;">
          </div>
        </div>

        <div class="form-actions mt-4">
          <button type="button" class="btn btn-outline" (click)="goBack()">Cancel</button>
          <button type="button" class="btn btn-outline" (click)="submitEvent('DRAFT')">Save Draft</button>
          <button type="submit" class="btn btn-primary" [disabled]="isSubmitting">
            <i *ngIf="isSubmitting" class="fas fa-spinner fa-spin"></i> {{ isSubmitting ? 'Publishing...' : 'Publish Event' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page-container { max-width: 900px; margin: 0 auto; padding-bottom: 3rem; }
    .page-header { margin-bottom: 2rem; h1 { font-size: 2.25rem; font-weight: 800; margin: 0; span { color: var(--primary-color, #2563eb); } } p { color: #64748b; font-size: 1.1rem; } }
    .btn-back { background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0; &:hover { color: #1e293b; } }
    .mt-3 { margin-top: 1rem; }
    .mt-4 { margin-top: 2rem; }
    .glass-card { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); border-radius: 1.25rem; border: 1px solid rgba(255, 255, 255, 0.5); box-shadow: 0 4px 20px rgba(0,0,0,0.05); padding: 2rem; }
    .event-form h3 { margin: 0 0 1.5rem 0; font-size: 1.25rem; font-weight: 700; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.75rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; }
    .form-group label { font-weight: 600; font-size: 0.875rem; color: #475569; }
    .form-control { padding: 0.875rem 1rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; font-size: 0.95rem; outline: none; transition: all 0.2s; background: #f8fafc; &:focus { border-color: #2563eb; background: #fff; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); } }
    .form-row { display: flex; gap: 1.5rem; @media (max-width: 768px) { flex-direction: column; gap: 0; } .form-group { flex: 1; } .flex-2 { flex: 2; } .flex-1 { flex: 1; } }
    .file-drop-zone { border: 2px dashed #cbd5e1; border-radius: 1rem; padding: 3rem 2rem; text-align: center; cursor: pointer; transition: all 0.2s; background: #f8fafc; }
    .file-drop-zone:hover, .file-drop-zone.drag-over { border-color: #2563eb; background: #eff6ff; }
    .drop-content { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: #64748b; i { color: #94a3b8; margin-bottom: 0.5rem; } }
    .selected-file { flex-direction: row; justify-content: center; p { font-weight: 600; color: #1e293b; margin: 0; } }
    .btn-clear { background: none; border: none; color: #ef4444; cursor: pointer; padding: 0.25rem; margin-left: 0.5rem; &:hover { color: #dc2626; } }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0; }
    .btn { padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem; border: none; cursor: pointer; transition: all 0.2s; }
    .btn-primary { background: #2563eb; color: white; &:hover { background: #1d4ed8; } }
    .btn-outline { background: white; border: 1px solid #e2e8f0; color: #1e293b; &:hover { background: #f8fafc; } }
    .animate-up { animation: fadeInUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class EventCreateComponent {
  isSubmitting = false;
  newEvent: Partial<SocietyEvent> = { category: 'CULTURAL', status: 'UPCOMING' };
  
  isDragging = false;
  selectedFile: File | null = null;

  constructor(
    private eventService: SocietyEventService,
    private router: Router
  ) {}

  goBack() {
    this.router.navigate(['/events']);
  }

  submitEvent(status: string = 'UPCOMING') {
    if (!this.newEvent.title || !this.newEvent.eventDate || !this.newEvent.endDate || !this.newEvent.location || !this.newEvent.description) {
      alert('Please fill out all required fields.');
      return;
    }
    
    this.newEvent.status = status;
    this.isSubmitting = true;
    
    this.eventService.createEvent(this.newEvent, this.selectedFile || undefined).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.goBack();
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
        alert('Failed to create event. Please try again.');
      }
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  clearFile(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
  }
}
