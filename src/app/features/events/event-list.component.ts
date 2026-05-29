import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SocietyEventService } from '../../core/services/society-event.service';
import { AuthService } from '../../core/auth/auth.service';
import { SocietyEvent, EventListRequest } from '../../core/models/society-event.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="events-container animate-up">
      <header class="page-header">
        <div class="header-content">
          <h1>Community <span>Events</span></h1>
          <p>Join and participate in society gatherings and activities</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" *ngIf="isAdmin" (click)="createEvent()"><i class="fas fa-plus"></i> Create Event</button>
        </div>
      </header>

      <!-- Filters & Categories -->
      <div class="filter-section glass-card">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" [(ngModel)]="searchTerm" (keyup.enter)="applyFilters()" placeholder="Search events by title or location (Press Enter)...">
        </div>
        <div class="categories">
          <button 
            *ngFor="let cat of categories" 
            [class.active]="currentCategory === cat"
            (click)="setCategory(cat)"
            class="filter-tab">
            {{ cat === '' ? 'All' : (cat | titlecase) }}
          </button>
        </div>
      </div>

      <!-- Events Grid -->
      <div class="events-grid" *ngIf="!isLoading && events && events.length > 0">
        <div *ngFor="let event of events" class="event-card glass-card animate-up">
          <div class="card-image" [style.backgroundImage]="'url(' + (event.imageUrl || defaultImageUrl) + ')'">
            <div class="category-badge">{{ event.category || 'EVENT' }}</div>
            <div class="status-overlay" *ngIf="event.status === 'COMPLETED'">Completed</div>
          </div>
          
          <div class="card-content">
            <div class="event-date">
              <div class="day">{{ (event.eventDate || event.startDate || '') | date:'dd' }}</div>
              <div class="month">{{ (event.eventDate || event.startDate || '') | date:'MMM' }}</div>
            </div>
            
            <div class="event-details">
              <h3>{{ event.title || 'Untitled Event' }}</h3>
              <p class="location"><i class="fas fa-map-marker-alt"></i> {{ event.location || 'TBA' }}</p>
              <p class="time"><i class="fas fa-clock"></i> {{ (event.eventDate || event.startDate || '') | date:'shortTime' }} - {{ (event.endDate || '') | date:'shortTime' }}</p>
              
              <p class="description">{{ event.description || 'No description available.' }}</p>

              <div class="card-actions">
                <button class="btn btn-outline-sm" (click)="viewEvent(event.id)"><i class="fas fa-eye"></i> View Details</button>
                <button class="btn btn-outline-sm edit-btn" *ngIf="isAdmin" (click)="editEvent(event.id)"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-outline-sm delete-btn" *ngIf="isAdmin" (click)="deleteEvent(event.id)"><i class="fas fa-trash"></i> Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination-controls" *ngIf="!isLoading && totalPages > 1">
        <button class="btn btn-outline-sm" [disabled]="currentPage === 0" (click)="changePage(currentPage - 1)">Previous</button>
        <span class="page-info">Page {{ currentPage + 1 }} of {{ totalPages }}</span>
        <button class="btn btn-outline-sm" [disabled]="currentPage === totalPages - 1" (click)="changePage(currentPage + 1)">Next</button>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && (!events || events.length === 0)" class="empty-state glass-card">
        <i class="fas fa-calendar-times"></i>
        <p>No events available at the moment.</p>
      </div>

      <!-- Skeleton Loaders -->
      <div class="events-grid" *ngIf="isLoading">
         <div *ngFor="let i of [1,2,3,4]" class="event-card glass-card skeleton-card">
            <div class="skeleton-image"></div>
            <div class="card-content">
               <div class="skeleton-text"></div>
               <div class="skeleton-text short"></div>
            </div>
         </div>
      </div>
    </div>
  `,
  styles: [`
    .events-container { max-width: 1400px; margin: 0 auto; }
    
    .page-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem;
      h1 { font-size: 2.25rem; font-weight: 800; margin: 0; letter-spacing: -0.02em; span { color: var(--primary-color, #2563eb); } }
      p { color: #64748b; margin: 0.5rem 0 0 0; font-size: 1.1rem; }
    }

    .header-actions { display: flex; gap: 1rem; }

    .filter-section {
      display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem !important; margin-bottom: 2.5rem; gap: 2rem;
      @media (max-width: 1024px) { flex-direction: column; align-items: stretch; }
    }

    .search-box {
      position: relative; flex: 1; max-width: 400px;
      i { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
      input {
        width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem; border: 1px solid #e2e8f0; border-radius: 0.75rem;
        font-size: 0.95rem; outline: none; transition: all 0.2s;
        &:focus { border-color: var(--primary-color, #2563eb); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
      }
    }

    .categories { display: flex; gap: 0.25rem; background: #f1f5f9; padding: 0.375rem; border-radius: 1rem; }
    .filter-tab {
      padding: 0.5rem 1.25rem; border-radius: 0.75rem; border: none; background: transparent;
      color: #64748b; font-weight: 600; cursor: pointer; transition: all 0.2s;
      &:hover { color: #1e293b; }
      &.active { background: white; color: #1e293b; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    }

    .events-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 2rem;
      @media (max-width: 768px) { grid-template-columns: 1fr; }
    }

    .event-card {
      padding: 0 !important; overflow: hidden; display: flex; flex-direction: column;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      &:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important; }
    }

    .card-image {
      height: 200px; background-size: cover; background-position: center; position: relative;
      .category-badge {
        position: absolute; top: 1rem; left: 1rem; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(4px);
        padding: 0.375rem 0.75rem; border-radius: 0.5rem; font-size: 0.75rem; font-weight: 800; color: #2563eb; text-transform: uppercase;
      }
      .status-overlay {
        position: absolute; inset: 0; background: rgba(30, 41, 59, 0.6); display: flex; align-items: center; justify-content: center;
        color: white; font-weight: 800; font-size: 1.5rem; text-transform: uppercase; letter-spacing: 0.1em;
      }
    }

    .card-content {
      padding: 1.5rem; display: flex; gap: 1.5rem;
    }

    .event-date {
      display: flex; flex-direction: column; align-items: center; justify-content: start;
      .day { font-size: 1.75rem; font-weight: 800; color: #1e293b; line-height: 1; }
      .month { font-size: 0.875rem; font-weight: 700; color: #2563eb; text-transform: uppercase; }
    }

    .event-details {
      flex: 1;
      h3 { margin: 0 0 0.5rem 0; font-size: 1.25rem; font-weight: 800; color: #1e293b; }
      p { margin: 0.25rem 0; font-size: 0.875rem; color: #64748b; display: flex; align-items: center; gap: 0.5rem; }
      .description { margin: 1rem 0; line-height: 1.5; color: #475569; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    }

    .card-actions { display: flex; gap: 0.75rem; margin-top: auto; flex-wrap: wrap; }

    .btn-outline-sm { padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; background: white; color: #64748b; cursor: pointer; transition: all 0.2s; &:hover:not(:disabled) { border-color: #2563eb; color: #2563eb; } &:disabled { opacity: 0.5; cursor: not-allowed; } }
    .edit-btn { color: #f59e0b !important; border-color: #fef3c7 !important; &:hover { background: #fffbeb !important; border-color: #f59e0b !important; } }
    .delete-btn { color: #ef4444 !important; border-color: #fee2e2 !important; &:hover { background: #fef2f2 !important; border-color: #ef4444 !important; } }

    .empty-state { text-align: center; padding: 5rem !important; i { font-size: 3rem; color: #cbd5e1; margin-bottom: 1.5rem; display: block; } p { font-size: 1.1rem; color: #64748b; margin-bottom: 2rem; } }

    .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border-radius: 1.25rem; border: 1px solid rgba(255, 255, 255, 0.5); box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    
    .btn { padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; border: none; cursor: pointer; transition: all 0.2s; }
    .btn-primary { background: #2563eb; color: white; &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); } }
    .btn-outline { background: white; border: 1px solid #e2e8f0; color: #1e293b; &:hover { background: #f8fafc; } }
    
    .pagination-controls { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 2rem; }
    .page-info { font-weight: 600; color: #475569; }

    /* Skeleton loaders */
    .skeleton-card { height: 400px; display: flex; flex-direction: column; }
    .skeleton-image { height: 200px; background: #e2e8f0; animation: pulse 1.5s infinite; }
    .skeleton-text { height: 20px; background: #e2e8f0; margin-bottom: 1rem; border-radius: 4px; animation: pulse 1.5s infinite; }
    .skeleton-text.short { width: 60%; }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

    .animate-up { animation: fadeInUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class EventListComponent implements OnInit {
  events: SocietyEvent[] = [];
  
  // Pagination details
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  
  // Filters
  searchTerm: string = '';
  currentCategory: string = '';
  categories: string[] = ['', 'cultural', 'festival', 'sports', 'meeting', 'charity'];
  
  isLoading = true;
  isAdmin = false;
  defaultImageUrl = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80';

  constructor(
    private eventService: SocietyEventService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isAdmin = user?.roles?.some(r => ['ADMIN', 'SUPER_ADMIN', 'SOCIETY_ADMIN'].includes(r)) || false;
    });
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    
    const request: EventListRequest = {
      page: this.currentPage,
      size: this.pageSize,
      search: this.searchTerm,
      category: this.currentCategory ? this.currentCategory.toUpperCase() : undefined,
      sortBy: 'eventDate',
      sortDirection: 'DESC'
    };

    this.eventService.getEvents(request)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }))
      .subscribe(pageData => {
        if (pageData) {
          this.events = pageData.content || [];
          this.totalPages = pageData.totalPages || 0;
          this.totalElements = pageData.totalElements || 0;
        } else {
          this.events = [];
        }
      });
  }

  changePage(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.currentPage = newPage;
      this.loadEvents();
    }
  }

  setCategory(cat: string): void {
    this.currentCategory = cat;
    this.currentPage = 0; // reset to first page
    this.loadEvents();
  }

  applyFilters(): void {
    this.currentPage = 0; // reset to first page
    this.loadEvents();
  }

  createEvent() {
    this.router.navigate(['/events/create']);
  }

  editEvent(id: number | undefined) {
    if (id) {
      this.router.navigate(['/events/edit', id]);
    }
  }

  viewEvent(id: number | undefined) {
    if (id) {
      this.router.navigate(['/events/view', id]);
    }
  }

  deleteEvent(id: number | undefined): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe({
        next: (success) => {
          if (success) {
            this.loadEvents();
          } else {
            alert('Failed to delete event.');
          }
        },
        error: (err) => {
          console.error(err);
          alert('Failed to delete event.');
        }
      });
    }
  }
}
