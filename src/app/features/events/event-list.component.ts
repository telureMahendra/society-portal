import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocietyEventService } from '../../core/services/society-event.service';
import { SocietyEvent } from '../../core/models/society-event.model';

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
          <button class="btn btn-outline"><i class="fas fa-calendar-alt"></i> My Calendar</button>
          <button class="btn btn-primary"><i class="fas fa-plus"></i> Propose Event</button>
        </div>
      </header>

      <!-- Filters & Categories -->
      <div class="filter-section glass-card">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" [(ngModel)]="searchTerm" (input)="applyFilters()" placeholder="Search events by title or location...">
        </div>
        <div class="categories">
          <button 
            *ngFor="let cat of categories" 
            [class.active]="currentCategory === cat"
            (click)="setCategory(cat)"
            class="filter-tab">
            {{ cat | titlecase }}
          </button>
        </div>
      </div>

      <!-- Events Grid -->
      <div class="events-grid">
        <div *ngFor="let event of filteredEvents" class="event-card glass-card animate-up">
          <div class="card-image" [style.backgroundImage]="'url(' + (event.imageUrl || defaultImageUrl) + ')'">
            <div class="category-badge">{{ event.category }}</div>
            <div class="status-overlay" *ngIf="event.status === 'COMPLETED'">Completed</div>
          </div>
          
          <div class="card-content">
            <div class="event-date">
              <div class="day">{{ event.startDate | date:'dd' }}</div>
              <div class="month">{{ event.startDate | date:'MMM' }}</div>
            </div>
            
            <div class="event-details">
              <h3>{{ event.title }}</h3>
              <p class="location"><i class="fas fa-map-marker-alt"></i> {{ event.location }}</p>
              <p class="time"><i class="fas fa-clock"></i> {{ event.startDate | date:'shortTime' }} - {{ event.endDate | date:'shortTime' }}</p>
              
              <p class="description">{{ event.description }}</p>

              <div class="attendees" *ngIf="event.currentAttendees">
                <div class="avatar-stack">
                  <div class="mini-avatar" *ngFor="let i of [1,2,3]"></div>
                  <div class="plus-count">+{{ event.currentAttendees - 3 }} joined</div>
                </div>
              </div>

              <div class="card-actions">
                <button class="btn btn-primary-sm" (click)="toggleRSVP(event)">
                  <i class="fas" [ngClass]="isRSVPed(event.id) ? 'fa-check' : 'fa-hand-paper'"></i>
                  {{ isRSVPed(event.id) ? 'Going' : 'Interested' }}
                </button>
                <button class="btn btn-outline-sm"><i class="fas fa-share-alt"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="filteredEvents.length === 0" class="empty-state glass-card">
        <i class="fas fa-calendar-times"></i>
        <p>No events found matching your current filters.</p>
        <button (click)="resetFilters()" class="btn btn-primary">Discover All Events</button>
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

    .avatar-stack {
      display: flex; align-items: center; margin-bottom: 1.5rem;
      .mini-avatar { width: 24px; height: 24px; border-radius: 50%; background: #e2e8f0; border: 2px solid white; margin-left: -8px; &:first-child { margin-left: 0; } }
      .plus-count { font-size: 0.75rem; font-weight: 600; color: #94a3b8; margin-left: 0.5rem; }
    }

    .card-actions { display: flex; gap: 0.75rem; margin-top: auto; }

    .btn-primary-sm { padding: 0.5rem 1rem; border-radius: 0.5rem; background: #2563eb; color: white; border: none; font-weight: 700; font-size: 0.8125rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s; &:hover { background: #1d4ed8; } }
    .btn-outline-sm { padding: 0.5rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; background: white; color: #64748b; cursor: pointer; transition: all 0.2s; &:hover { border-color: #2563eb; color: #2563eb; } }

    .empty-state { text-align: center; padding: 5rem !important; i { font-size: 3rem; color: #cbd5e1; margin-bottom: 1.5rem; display: block; } p { font-size: 1.1rem; color: #64748b; margin-bottom: 2rem; } }

    .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border-radius: 1.25rem; border: 1px solid rgba(255, 255, 255, 0.5); box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    
    .btn { padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; border: none; cursor: pointer; transition: all 0.2s; }
    .btn-primary { background: #2563eb; color: white; &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); } }
    .btn-outline { background: white; border: 1px solid #e2e8f0; color: #1e293b; &:hover { background: #f8fafc; } }

    .animate-up { animation: fadeInUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class EventListComponent implements OnInit {
  events: SocietyEvent[] = [];
  filteredEvents: SocietyEvent[] = [];
  searchTerm: string = '';
  currentCategory: string = 'all';
  categories: string[] = ['all', 'cultural', 'festival', 'sports', 'meeting', 'charity'];
  defaultImageUrl = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80';

  // Track local RSVPs for demo
  rsvpedEvents = new Set<number>();

  constructor(private eventService: SocietyEventService) { }

  ngOnInit(): void {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
      this.applyFilters();
    });
  }

  setCategory(cat: string): void {
    this.currentCategory = cat;
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.currentCategory = 'all';
    this.applyFilters();
  }

  applyFilters(): void {
    const searchStr = this.searchTerm.toLowerCase();
    this.filteredEvents = this.events.filter(event => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchStr) ||
        event.location.toLowerCase().includes(searchStr) ||
        event.description.toLowerCase().includes(searchStr);

      const matchesCategory =
        this.currentCategory === 'all' ||
        event.category.toLowerCase() === this.currentCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }

  toggleRSVP(event: SocietyEvent): void {
    if (this.rsvpedEvents.has(event.id)) {
      this.rsvpedEvents.delete(event.id);
      if (event.currentAttendees) event.currentAttendees--;
    } else {
      this.rsvpedEvents.add(event.id);
      if (event.currentAttendees) event.currentAttendees++;
    }
  }

  isRSVPed(eventId: number): boolean {
    return this.rsvpedEvents.has(eventId);
  }
}
