import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoticeService } from '../../core/services/notice.service';
import { Notice } from '../../core/models/notice.model';

@Component({
  selector: 'app-notice-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="notices-container animate-up">
      <header class="page-header">
        <div class="header-content">
          <h1>Society <span>Notices</span></h1>
          <p>Important announcements and community updates</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline"><i class="fas fa-archive"></i> Archives</button>
          <button class="btn btn-primary"><i class="fas fa-edit"></i> Create Notice</button>
        </div>
      </header>

      <!-- Category Filters -->
      <div class="filter-section glass-card">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" [(ngModel)]="searchTerm" (input)="applyFilters()" placeholder="Search notices by title or content...">
        </div>
        <div class="categories">
          <button 
            *ngFor="let category of categories" 
            [class.active]="currentCategory === category"
            (click)="setCategory(category)"
            class="category-btn">
            {{ category | titlecase }}
          </button>
        </div>
      </div>

      <!-- Notices Grid -->
      <div class="notices-grid">
        <!-- Pinned / Priority Notice (Hero) -->
        <div *ngFor="let notice of pinnedNotices" class="notice-card featured glass-card animate-up">
          <div class="priority-tag" [class]="notice.priority.toLowerCase()">
            <i class="fas fa-thumbtack"></i> {{ notice.priority }}
          </div>
          <div class="notice-info">
            <span class="category">{{ notice.category }}</span>
            <span class="date">{{ notice.publishDate | date:'fullDate' }}</span>
          </div>
          <h2>{{ notice.title }}</h2>
          <p>{{ notice.content }}</p>
          <div class="notice-footer">
            <span class="author">By <strong>{{ notice.author }}</strong></span>
            <button class="link-btn">Read Full Notice <i class="fas fa-arrow-right"></i></button>
          </div>
        </div>

        <!-- Regular Notices -->
        <div class="regular-notices">
          <div *ngFor="let notice of filteredNotices" class="notice-card glass-card animate-up delay-1">
            <div class="priority-dot" [class]="notice.priority.toLowerCase()" [title]="notice.priority + ' Priority'"></div>
            <div class="notice-info">
              <span class="category">{{ notice.category }}</span>
              <span class="date">{{ notice.publishDate | date:'mediumDate' }}</span>
            </div>
            <h3>{{ notice.title }}</h3>
            <p class="truncate">{{ notice.content }}</p>
            <div class="notice-footer">
              <span class="author">By {{ notice.author }}</span>
              <div class="actions">
                <button class="icon-btn" title="View"><i class="fas fa-eye"></i></button>
                <button class="icon-btn" title="Download"><i class="fas fa-download"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="filteredNotices.length === 0 && pinnedNotices.length === 0" class="empty-state glass-card">
        <i class="fas fa-bullhorn"></i>
        <p>No notices found matching your criteria.</p>
        <button (click)="resetFilters()" class="btn btn-primary">View All Notices</button>
      </div>
    </div>
  `,
  styles: [`
    .notices-container { max-width: 1400px; margin: 0 auto; }
    
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
      position: relative; flex: 1; max-width: 500px;
      i { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
      input {
        width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem; border: 1px solid #e2e8f0; border-radius: 0.75rem;
        font-size: 0.95rem; outline: none; transition: all 0.2s;
        &:focus { border-color: var(--primary-color, #2563eb); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
      }
    }

    .categories { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .category-btn {
      padding: 0.5rem 1.25rem; border-radius: 2rem; border: 1px solid #e2e8f0; background: white;
      color: #64748b; font-weight: 600; cursor: pointer; transition: all 0.2s;
      &:hover { border-color: #cbd5e1; background: #f8fafc; }
      &.active { background: var(--primary-color, #2563eb); color: white; border-color: var(--primary-color, #2563eb); }
    }

    .notices-grid {
      display: flex; flex-direction: column; gap: 1.5rem;
    }

    .notice-card {
      padding: 2.5rem; position: relative;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      &.featured {
        border-left: 6px solid #ef4444; background: linear-gradient(to right, rgba(239, 68, 68, 0.05), transparent);
        h2 { font-size: 2rem; font-weight: 800; margin: 1rem 0; color: #1e293b; }
        p { font-size: 1.25rem; color: #475569; line-height: 1.6; margin-bottom: 2rem; }
      }

      &:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.08); }
    }

    .regular-notices {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 1.5rem;
      @media (max-width: 768px) { grid-template-columns: 1fr; }
    }

    .priority-tag {
      position: absolute; top: 1.5rem; right: 1.5rem; padding: 0.375rem 0.75rem; border-radius: 0.5rem;
      font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.5rem;
      &.critical { background: #fee2e2; color: #991b1b; }
      &.high { background: #ffedd5; color: #9a3412; }
      &.medium { background: #fef9c3; color: #854d0e; }
      &.low { background: #f1f5f9; color: #475569; }
    }

    .priority-dot {
      width: 12px; height: 12px; border-radius: 50%; position: absolute; top: 2rem; right: 2rem;
      &.critical { background: #ef4444; box-shadow: 0 0 8px rgba(239, 68, 68, 0.4); }
      &.high { background: #f97316; }
      &.medium { background: #f59e0b; }
      &.low { background: #94a3b8; }
    }

    .notice-info {
      display: flex; align-items: center; gap: 1rem; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;
      .category { color: var(--primary-color, #2563eb); text-transform: uppercase; letter-spacing: 0.05em; }
      .date { color: #94a3b8; }
    }

    .notice-card h3 { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin: 0.5rem 0 1rem 0; }
    .notice-card p.truncate { color: #64748b; line-height: 1.6; margin-bottom: 2rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

    .notice-footer {
      display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 1.5rem;
      .author { font-size: 0.875rem; color: #64748b; }
    }

    .link-btn {
      background: none; border: none; color: #2563eb; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;
      &:hover { text-decoration: underline; }
    }

    .icon-btn {
      width: 32px; height: 32px; border-radius: 0.5rem; border: 1px solid #e2e8f0; background: white; color: #64748b; cursor: pointer; transition: all 0.2s;
      &:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
    }

    .empty-state { text-align: center; padding: 5rem !important; i { font-size: 3rem; color: #cbd5e1; margin-bottom: 1.5rem; } p { font-size: 1.25rem; color: #64748b; margin-bottom: 2rem; } }

    .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border-radius: 1.25rem; border: 1px solid rgba(255, 255, 255, 0.5); box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    
    .btn {
      padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; border: none; cursor: pointer; transition: all 0.2s;
      &.btn-primary { background: #2563eb; color: white; &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); } }
      &.btn-outline { background: white; border: 1px solid #e2e8f0; color: #1e293b; &:hover { background: #f8fafc; } }
    }

    .animate-up { animation: fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
    .delay-1 { animation-delay: 0.1s; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class NoticeListComponent implements OnInit {
  notices: Notice[] = [];
  filteredNotices: Notice[] = [];
  pinnedNotices: Notice[] = [];
  searchTerm: string = '';
  currentCategory: string = 'all';
  categories: string[] = ['all', 'general', 'maintenance', 'event', 'security', 'government'];

  constructor(private noticeService: NoticeService) { }

  ngOnInit(): void {
    this.noticeService.getNotices().subscribe(notices => {
      this.notices = notices;
      this.applyFilters();
    });
  }

  setCategory(category: string): void {
    this.currentCategory = category;
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.currentCategory = 'all';
    this.applyFilters();
  }

  applyFilters(): void {
    const searchStr = this.searchTerm.toLowerCase();

    const baseFiltered = this.notices.filter(notice => {
      const matchesSearch =
        notice.title.toLowerCase().includes(searchStr) ||
        notice.content.toLowerCase().includes(searchStr);

      const matchesCategory =
        this.currentCategory === 'all' ||
        notice.category.toLowerCase() === this.currentCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    this.pinnedNotices = baseFiltered.filter(n => n.isPinned);
    this.filteredNotices = baseFiltered.filter(n => !n.isPinned);
  }
}
