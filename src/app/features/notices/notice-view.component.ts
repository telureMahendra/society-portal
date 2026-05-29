import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NoticeService } from '../../core/services/notice.service';
import { NotificationService } from '../../core/services/notification.service';
import { Notice } from '../../core/models/notice.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-notice-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="notice-view-container animate-up">
      <header class="page-header">
        <div class="header-content">
          <button class="back-btn" routerLink="/notices"><i class="fas fa-arrow-left"></i> Back to Notices</button>
        </div>
      </header>

      <div *ngIf="isLoading" class="loading-state glass-card">
        <i class="fas fa-spinner fa-spin"></i> Loading Notice Details...
      </div>

      <div *ngIf="!isLoading && notice" class="notice-card glass-card">
        <div class="priority-tag" [class]="notice.priority.toLowerCase()" [title]="notice.priority + ' Priority'">
            {{ notice.priority }} Priority
        </div>
        
        <div class="notice-meta">
          <span class="category">{{ notice.category }}</span>
          <span class="divider">•</span>
          <span class="date">Published: {{ notice.publishDate ? (notice.publishDate | date:'longDate') : 'Draft' }}</span>
          <span class="divider" *ngIf="notice.visibility !== 'PUBLIC'">•</span>
          <span class="visibility" *ngIf="notice.visibility !== 'PUBLIC'">
            Target: {{ notice.visibility === 'WING' ? 'Wing ' + notice.targetWing : 'Flat ' + notice.targetFlatNumber }}
          </span>
        </div>

        <h1 class="notice-title">{{ notice.title }}</h1>
        
        <div class="notice-content">
          <p [innerHTML]="formatContent(notice.content)"></p>
        </div>

        <div class="attachment-section" *ngIf="notice.attachmentUrl">
          <h3><i class="fas fa-paperclip"></i> Attachment</h3>
          <div class="attachment-card">
            <div class="attachment-info">
              <i class="fas fa-file-alt"></i>
              <span>{{ notice.attachmentName || 'Document attached' }}</span>
            </div>
            <a [href]="getAttachmentFullUrl(notice.attachmentUrl)" target="_blank" class="btn btn-outline" download>
              <i class="fas fa-download"></i> Download / View
            </a>
          </div>
        </div>

        <div class="notice-footer">
          <div class="author-info">
            <div class="avatar"><i class="fas fa-user"></i></div>
            <div class="author-details">
              <span class="name">Notice from Admin</span>
              <span class="role">Society Management</span>
            </div>
          </div>
          
          <div class="admin-actions">
            <button class="btn btn-outline" (click)="editNotice()"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-danger" (click)="deleteNotice()"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notice-view-container { max-width: 900px; margin: 0 auto; padding-bottom: 3rem; }
    
    .page-header {
      margin-bottom: 2rem;
      .back-btn { background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; padding: 0; margin-bottom: 1rem; transition: color 0.2s; &:hover { color: #2563eb; } }
    }

    .glass-card { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); border-radius: 1.25rem; border: 1px solid rgba(255, 255, 255, 0.5); box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    
    .loading-state { text-align: center; padding: 5rem; font-size: 1.25rem; color: #64748b; i { font-size: 2rem; margin-right: 1rem; color: #2563eb; } }

    .notice-card { padding: 3.5rem; position: relative; }

    .priority-tag {
      position: absolute; top: 2rem; right: 2rem; padding: 0.5rem 1rem; border-radius: 2rem;
      font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;
      &.urgent, &.critical { background: #fee2e2; color: #991b1b; }
      &.high { background: #ffedd5; color: #9a3412; }
      &.medium { background: #dbeafe; color: #1e40af; }
      &.low { background: #dcfce7; color: #166534; }
    }

    .notice-meta {
      display: flex; align-items: center; gap: 1rem; font-size: 0.95rem; font-weight: 600; margin-bottom: 1.5rem; color: #64748b; flex-wrap: wrap;
      .category { color: var(--primary-color, #2563eb); text-transform: uppercase; letter-spacing: 0.05em; background: #eff6ff; padding: 0.25rem 0.75rem; border-radius: 1rem; }
      .visibility { color: #8b5cf6; background: #f5f3ff; padding: 0.25rem 0.75rem; border-radius: 1rem; }
      .divider { color: #cbd5e1; }
    }

    .notice-title { font-size: 2.5rem; font-weight: 800; color: #1e293b; margin: 0 0 2.5rem 0; line-height: 1.2; letter-spacing: -0.02em; }

    .notice-content {
      font-size: 1.15rem; color: #334155; line-height: 1.8; margin-bottom: 3rem; white-space: pre-wrap;
      p { margin-bottom: 1.5rem; }
    }

    .attachment-section {
      background: #f8fafc; border-radius: 1rem; padding: 1.5rem; margin-bottom: 3rem; border: 1px solid #e2e8f0;
      h3 { font-size: 1.1rem; color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem; }
      .attachment-card {
        display: flex; justify-content: space-between; align-items: center; background: white; padding: 1rem 1.5rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;
        .attachment-info { display: flex; align-items: center; gap: 1rem; font-weight: 600; color: #334155; i { font-size: 1.5rem; color: #ef4444; } }
      }
    }

    .notice-footer {
      display: flex; justify-content: space-between; align-items: center; padding-top: 2rem; border-top: 1px solid #e2e8f0;
      @media (max-width: 640px) { flex-direction: column; gap: 2rem; align-items: flex-start; }
    }

    .author-info {
      display: flex; align-items: center; gap: 1rem;
      .avatar { width: 48px; height: 48px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
      .author-details { display: flex; flex-direction: column; .name { font-weight: 700; color: #1e293b; } .role { font-size: 0.85rem; color: #64748b; } }
    }

    .admin-actions { display: flex; gap: 1rem; }

    .btn {
      padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; border: none; cursor: pointer; transition: all 0.2s;
      &.btn-outline { background: white; border: 1px solid #e2e8f0; color: #1e293b; &:hover { background: #f8fafc; } }
      &.btn-danger { background: #fef2f2; color: #ef4444; border: 1px solid #fecaca; &:hover { background: #fee2e2; } }
    }

    .animate-up { animation: fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class NoticeViewComponent implements OnInit {
  noticeId!: number;
  notice?: Notice;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noticeService: NoticeService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.noticeId = +params['id'];
      this.loadNoticeDetails();
    });
  }

  loadNoticeDetails(): void {
    this.noticeService.getNoticeDetails(this.noticeId).subscribe({
      next: (notice) => {
        if (notice) {
          this.notice = notice;
        } else {
          this.notificationService.error('Notice not found');
          this.router.navigate(['/notices']);
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificationService.error('Failed to load notice details');
        this.isLoading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/notices']);
      }
    });
  }

  formatContent(content: string): string {
    if (!content) return '';
    // Basic formatting to convert newlines to <br> tags
    // A robust app might use a markdown parser or rich text sanitization here.
    return content.replace(/\n/g, '<br/>');
  }

  getAttachmentFullUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    // E.g. url = /uploads/notices/doc.pdf and apiBaseUrl = http://localhost:8080/api/v1
    // We want the host: http://localhost:8080/uploads/notices/doc.pdf
    const baseUrl = environment.apiBaseUrl;
    const hostIndex = baseUrl.indexOf('/api/v1');
    if (hostIndex !== -1 && url.startsWith('/')) {
        return baseUrl.substring(0, hostIndex) + url;
    }
    return baseUrl + url;
  }

  editNotice(): void {
    this.router.navigate(['/notices/edit', this.noticeId]);
  }

  deleteNotice(): void {
    if (confirm('Are you sure you want to delete this notice? This action cannot be undone.')) {
      this.noticeService.deleteNotice(this.noticeId).subscribe({
        next: (success) => {
          if (success) {
            this.notificationService.success('Notice deleted successfully');
            this.router.navigate(['/notices']);
          } else {
            this.notificationService.error('Failed to delete notice');
          }
        },
        error: () => {
          this.notificationService.error('Failed to delete notice');
        }
      });
    }
  }
}
