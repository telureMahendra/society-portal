import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SocietyEventService } from '../../core/services/society-event.service';
import { SocietyEvent } from '../../core/models/society-event.model';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-event-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container animate-up">
      <header class="page-header">
        <button class="btn-back" (click)="goBack()">
          <i class="fas fa-arrow-left"></i> Back to Events
        </button>
      </header>

      <div *ngIf="isLoading" class="loading-state">
        <i class="fas fa-spinner fa-spin fa-3x"></i>
        <p>Loading event details...</p>
      </div>

      <div *ngIf="!isLoading && event" class="event-details-card">
        <div class="hero-section" [style.background-image]="event.imageUrl ? 'url(' + event.imageUrl + ')' : 'linear-gradient(135deg, #2563eb, #1e40af)'">
          <div class="hero-overlay"></div>
          <div class="hero-content">
            <span class="category-badge">{{ event.category }}</span>
            <h1>{{ event.title }}</h1>
            <p class="status-badge" [class]="event.status.toLowerCase()">{{ event.status }}</p>
          </div>
        </div>

        <div class="details-content">
          <div class="info-grid">
            <div class="info-item">
              <div class="icon-box"><i class="fas fa-calendar-day"></i></div>
              <div class="info-text">
                <span class="label">Date & Time</span>
                <p>{{ event.eventDate | date:'medium' }} - {{ event.endDate | date:'shortTime' }}</p>
              </div>
            </div>
            
            <div class="info-item">
              <div class="icon-box"><i class="fas fa-map-marker-alt"></i></div>
              <div class="info-text">
                <span class="label">Location</span>
                <p>{{ event.location }}</p>
              </div>
            </div>

            <div class="info-item" *ngIf="event.organizer">
              <div class="icon-box"><i class="fas fa-user-tie"></i></div>
              <div class="info-text">
                <span class="label">Organizer</span>
                <p>{{ event.organizer }}</p>
              </div>
            </div>
          </div>

          <div class="description-section mt-4">
            <h3>About this event</h3>
            <p>{{ event.description }}</p>
          </div>

          <div class="admin-actions mt-4" *ngIf="isAdmin">
            <button class="btn btn-outline" (click)="editEvent()"><i class="fas fa-edit"></i> Edit Event</button>
            <button class="btn btn-danger" (click)="deleteEvent()"><i class="fas fa-trash"></i> Delete Event</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 900px; margin: 0 auto; padding-bottom: 3rem; }
    .page-header { margin-bottom: 2rem; }
    .btn-back { background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0; &:hover { color: #1e293b; } }
    .loading-state { text-align: center; padding: 4rem; color: #64748b; i { margin-bottom: 1rem; color: #2563eb; } }
    
    .event-details-card { background: white; border-radius: 1.5rem; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .hero-section { position: relative; height: 300px; background-size: cover; background-position: center; display: flex; align-items: flex-end; padding: 2rem; color: white; }
    .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2)); }
    .hero-content { position: relative; z-index: 1; }
    .hero-content h1 { font-size: 2.5rem; font-weight: 800; margin: 0.5rem 0; }
    
    .category-badge { background: #2563eb; color: white; padding: 0.25rem 1rem; border-radius: 99px; font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .status-badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.85rem; font-weight: 600; margin: 0; }
    .status-badge.upcoming { background: rgba(59, 130, 246, 0.2); color: #93c5fd; }
    
    .details-content { padding: 2.5rem; }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 2rem; }
    .info-item { display: flex; align-items: center; gap: 1rem; }
    .icon-box { width: 48px; height: 48px; border-radius: 12px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
    .info-text .label { font-size: 0.875rem; color: #64748b; font-weight: 600; }
    .info-text p { margin: 0; font-weight: 700; color: #1e293b; font-size: 1rem; }
    
    .description-section h3 { font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem; }
    .description-section p { color: #475569; line-height: 1.7; white-space: pre-wrap; }
    
    .admin-actions { display: flex; gap: 1rem; padding-top: 2rem; border-top: 1px solid #e2e8f0; }
    .btn { padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem; border: none; cursor: pointer; transition: all 0.2s; }
    .btn-outline { background: white; border: 1px solid #e2e8f0; color: #1e293b; &:hover { background: #f8fafc; } }
    .btn-danger { background: #fee2e2; color: #ef4444; border: 1px solid #fecaca; &:hover { background: #fca5a5; color: #b91c1c; } }
    
    .mt-4 { margin-top: 2rem; }
    .animate-up { animation: fadeInUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class EventViewComponent implements OnInit {
  isLoading = true;
  event: SocietyEvent | null = null;
  eventId!: number;
  isAdmin = false;

  constructor(
    private eventService: SocietyEventService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isAdmin = user?.roles?.some(r => ['ADMIN', 'SUPER_ADMIN', 'SOCIETY_ADMIN'].includes(r)) || false;
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.eventId = +id;
        this.loadEventDetails();
      } else {
        this.goBack();
      }
    });
  }

  loadEventDetails() {
    this.eventService.getEventById(this.eventId).subscribe({
      next: (data) => {
        if (data) {
          this.event = data;
        } else {
          alert('Event not found');
          this.goBack();
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        alert('Error loading event');
        this.goBack();
      }
    });
  }

  goBack() {
    this.router.navigate(['/events']);
  }

  editEvent() {
    this.router.navigate(['/events/edit', this.eventId]);
  }

  deleteEvent() {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(this.eventId).subscribe(success => {
        if (success) {
          this.goBack();
        } else {
          alert('Failed to delete event');
        }
      });
    }
  }
}
