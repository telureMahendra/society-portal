import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NoticeService } from '../../core/services/notice.service';
import { Notice, NoticeListRequest, Page } from '../../core/models/notice.model';

@Component({
  selector: 'app-notice-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="notices-container animate-up">
      <header class="page-header">
        <div class="header-content">
          <h1>Society <span>Notices</span></h1>
          <p>Important announcements and community updates</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" (click)="loadNotices()"><i class="fas fa-sync"></i> Refresh</button>
          <button class="btn btn-primary" routerLink="create"><i class="fas fa-edit"></i> Create Notice</button>
        </div>
      </header>

      <!-- Category Filters -->
      <div class="filter-section glass-card">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="onSearchChange($event)" placeholder="Search notices by title or content...">
        </div>
        <div class="categories">
          <button 
            *ngFor="let category of categories" 
            [class.active]="currentCategory === category.value"
            (click)="setCategory(category.value)"
            class="category-btn">
            {{ category.label }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="notices-grid">
        <div class="regular-notices">
          <div *ngFor="let _ of [1,2,3,4]" class="notice-card skeleton-card glass-card">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text" style="width: 70%"></div>
            <div class="skeleton skeleton-footer"></div>
          </div>
        </div>
      </div>

      <!-- Notices Grid -->
      <div *ngIf="!isLoading && notices.length > 0" class="notices-grid">
        <div class="regular-notices">
          <div *ngFor="let notice of notices" class="notice-card glass-card animate-up delay-1">
            <div class="priority-tag" [class]="notice.priority.toLowerCase()" [title]="notice.priority + ' Priority'">
                {{ notice.priority }}
            </div>
            <div class="notice-info">
              <span class="category">{{ notice.category }}</span>
              <span class="date" *ngIf="notice.publishDate">{{ notice.publishDate | date:'mediumDate' }}</span>
              <span class="date" *ngIf="!notice.publishDate">Draft</span>
            </div>
            <h3>{{ notice.title }}</h3>
            <p class="truncate">{{ notice.content }}</p>
            <div class="notice-footer">
              <span class="author">By {{ notice.createdBy ? 'Admin' : 'Unknown' }}</span>
              <div class="actions">
                <button class="link-btn" [routerLink]="['view', notice.id]">Read Full Notice <i class="fas fa-arrow-right"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div *ngIf="!isLoading && totalPages > 1" class="pagination-controls">
        <button class="btn btn-outline" [disabled]="currentPage === 0" (click)="changePage(currentPage - 1)">
          <i class="fas fa-chevron-left"></i> Previous
        </button>
        <span class="page-info">Page {{ currentPage + 1 }} of {{ totalPages }}</span>
        <button class="btn btn-outline" [disabled]="currentPage >= totalPages - 1" (click)="changePage(currentPage + 1)">
          Next <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && notices.length === 0" class="empty-state glass-card">
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
      display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem !important; margin-bottom: 2.5rem; gap: 1rem; flex-wrap: wrap;
      @media (max-width: 1024px) { flex-direction: column; align-items: stretch; }
    }

    .search-box {
      position: relative; flex: 1; min-width: 200px; max-width: 380px;
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
      display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 2rem;
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
      &.urgent, &.critical { background: #fee2e2; color: #991b1b; }
      &.high { background: #ffedd5; color: #9a3412; }
      &.medium { background: #dbeafe; color: #1e40af; }
      &.low { background: #dcfce7; color: #166534; }
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
      &:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
    }

    .pagination-controls {
      display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 1rem;
      .page-info { font-weight: 600; color: #475569; }
    }

    .animate-up { animation: fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
    .delay-1 { animation-delay: 0.1s; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    /* Skeleton Loading */
    .skeleton {
        background: #e2e8f0;
        border-radius: 4px;
        position: relative;
        overflow: hidden;
    }
    .skeleton::after {
        content: "";
        position: absolute;
        top: 0; right: 0; bottom: 0; left: 0;
        transform: translateX(-100%);
        background-image: linear-gradient(90deg, rgba(255,255,255,0) 0, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0));
        animation: shimmer 2s infinite;
    }
    .skeleton-title { width: 80%; height: 28px; margin-bottom: 15px; margin-top: 30px; }
    .skeleton-text { width: 100%; height: 16px; margin-bottom: 10px; }
    .skeleton-footer { width: 100%; height: 40px; margin-top: 30px; border-radius: 8px; }
    @keyframes shimmer { 100% { transform: translateX(100%); } }
  `]
})
export class NoticeListComponent implements OnInit, OnDestroy {
  notices: Notice[] = [];
  isLoading: boolean = true;
  
  searchTerm: string = '';
  currentCategory: string = '';
  
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;

  categories = [
    { label: 'All', value: '' },
    { label: 'General', value: 'GENERAL' },
    { label: 'Maintenance', value: 'MAINTENANCE' },
    { label: 'Event', value: 'EVENT' },
    { label: 'Security', value: 'SECURITY' },
    { label: 'Government', value: 'GOVERNMENT' }
  ];

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(private noticeService: NoticeService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.currentPage = 0;
      this.loadNotices();
    });

    this.loadNotices();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadNotices(): void {
    this.isLoading = true;
    
    const request: NoticeListRequest = {
      page: this.currentPage,
      size: this.pageSize,
      sortBy: 'createdAt',
      sortDirection: 'DESC'
    };

    if (this.searchTerm) {
      request.search = this.searchTerm;
    }

    if (this.currentCategory) {
      request.category = this.currentCategory;
    }

    this.noticeService.getNotices(request).subscribe({
      next: (page: Page<Notice> | null) => {
        if (page) {
          this.notices = page.content;
          this.totalPages = page.totalPages;
          this.totalElements = page.totalElements;
        } else {
          this.notices = [];
          this.totalPages = 0;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  setCategory(category: string): void {
    if (this.currentCategory !== category) {
      this.currentCategory = category;
      this.currentPage = 0;
      this.loadNotices();
    }
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.currentCategory = '';
    this.currentPage = 0;
    this.loadNotices();
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.currentPage = newPage;
      this.loadNotices();
    }
  }
}

