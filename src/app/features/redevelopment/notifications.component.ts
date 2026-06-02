import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ProjectNotification {
  id: string;
  title: string;
  body: string;
  group: string;
  status: 'Sent' | 'Pending' | 'Draft';
  date: string;
  time: string;
}

@Component({
  selector: 'app-redevelopment-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="notifications-container">
    <div class="page-header">
      <div>
        <p class="subtitle-label">Broadcaster Hub</p>
        <h1>Notifications</h1>
        <p class="subtitle">Manage broadcasts, trigger alerts, and track delivery status.</p>
      </div>
      <button class="primary-button" (click)="isComposeOpen = true">
        <i class="fas fa-paper-plane"></i>
        New Notification
      </button>
    </div>

    <div class="controls-section">
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="Search notifications..." [(ngModel)]="searchQuery" />
      </div>
    </div>

    <section class="notifications-grid" *ngIf="filteredNotifs.length > 0; else emptyState">
      <article class="notification-card" *ngFor="let notif of filteredNotifs">
        <div class="card-header">
          <h3>{{ notif.title }}</h3>
          <button class="delete-button" (click)="removeNotif(notif.id)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <p class="notification-body">{{ notif.body }}</p>
        <div class="card-footer">
          <span class="badge group">{{ notif.group }}</span>
          <span class="status-badge" [ngClass]="notif.status.toLowerCase()">{{ notif.status }}</span>
          <span class="timestamp">{{ notif.date }} at {{ notif.time }}</span>
        </div>
      </article>
    </section>

    <ng-template #emptyState>
      <div class="empty-state">
        <i class="fas fa-bell"></i>
        <p>No notifications found. Create one to get started.</p>
      </div>
    </ng-template>

    <!-- Compose Modal -->
    <div class="modal-backdrop" *ngIf="isComposeOpen" (click)="isComposeOpen = false">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Compose Notification</h2>
          <button class="close-button" (click)="isComposeOpen = false">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form (ngSubmit)="composeNotification()" class="modal-form">
          <label>
            <span>Subject</span>
            <input type="text" required [(ngModel)]="title" name="title" placeholder="Notification subject" />
          </label>

          <label>
            <span>Message Body</span>
            <textarea [(ngModel)]="body" name="body" placeholder="Enter notification message" rows="5"></textarea>
          </label>

          <label>
            <span>Send To</span>
            <select [(ngModel)]="recipient" name="recipient">
              <option value="All Residents">All Residents</option>
              <option value="Committee Members">Committee Members</option>
              <option value="Unit Owners">Unit Owners</option>
              <option value="Vehicle Owners">Vehicle Owners</option>
            </select>
          </label>

          <label>
            <span>Status</span>
            <select [(ngModel)]="status" name="status">
              <option value="Sent">Sent</option>
              <option value="Pending">Pending</option>
              <option value="Draft">Draft</option>
            </select>
          </label>

          <div class="modal-actions">
            <button type="button" class="secondary-button" (click)="isComposeOpen = false">Cancel</button>
            <button type="submit" class="primary-button">Send</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .notifications-container {
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

    .controls-section {
      display: flex;
      gap: 1rem;
    }

    .search-bar {
      flex: 1;
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

    .notifications-grid {
      display: grid;
      gap: 1rem;
    }

    .notification-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 1rem;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      transition: all 0.2s ease;
    }

    .notification-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      gap: 1rem;
    }

    .card-header h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: #0f172a;
    }

    .delete-button {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .delete-button:hover {
      background: #fee2e2;
      color: #dc2626;
    }

    .notification-body {
      margin: 0;
      color: #475569;
      line-height: 1.5;
      font-size: 0.95rem;
    }

    .card-footer {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      padding-top: 0.75rem;
      border-top: 1px solid #e2e8f0;
    }

    .badge {
      display: inline-block;
      padding: 0.35rem 0.75rem;
      border-radius: 0.35rem;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .badge.group {
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

    .status-badge.sent {
      background: #dcfce7;
      color: #16a34a;
    }

    .status-badge.pending {
      background: #fef9c3;
      color: #ca8a04;
    }

    .status-badge.draft {
      background: #f3e8ff;
      color: #9333ea;
    }

    .timestamp {
      margin-left: auto;
      color: #94a3b8;
      font-size: 0.85rem;
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
      width: min(100%, 600px);
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
      gap: 1rem;
      padding: 1.5rem;
    }

    .modal-form label {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .modal-form span {
      font-weight: 600;
      color: #334155;
      font-size: 0.9rem;
    }

    .modal-form input,
    .modal-form select,
    .modal-form textarea {
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      font-size: 0.95rem;
      color: #0f172a;
      font-family: inherit;
    }

    .modal-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .secondary-button {
      background: #f1f5f9;
      color: #334155;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
    }
  `]
})
export class RedevelopmentNotificationsComponent {
  isComposeOpen = false;
  searchQuery = '';
  title = '';
  body = '';
  recipient = 'All Residents';
  status: 'Sent' | 'Pending' | 'Draft' = 'Sent';

  notifications: ProjectNotification[] = [
    {
      id: 'notif1',
      title: 'Phase 2 Demolition Update',
      body: 'The north block excavation is scheduled to commence this coming Monday. Heavy machinery will be active between 8:00 AM and 5:00 PM.',
      group: 'Committee Members',
      status: 'Sent',
      date: 'Oct 24, 2023',
      time: '09:15 AM'
    },
    {
      id: 'notif2',
      title: 'General Body Meeting',
      body: 'Reminder for the upcoming General Body Meeting regarding floor space approval on October 28th.',
      group: 'All Residents',
      status: 'Pending',
      date: 'Oct 28, 2023',
      time: '06:00 PM'
    },
    {
      id: 'notif3',
      title: 'Holiday Service Notice',
      body: 'Water supply maintenance scheduled during the upcoming holiday weekend. Backup tanks are pre-staged.',
      group: 'All Residents',
      status: 'Draft',
      date: 'Oct 24, 2023',
      time: '02:45 PM'
    }
  ];

  get filteredNotifs(): ProjectNotification[] {
    if (!this.searchQuery.trim()) return this.notifications;
    const query = this.searchQuery.toLowerCase();
    return this.notifications.filter(n =>
      n.title.toLowerCase().includes(query) ||
      n.body.toLowerCase().includes(query) ||
      n.group.toLowerCase().includes(query)
    );
  }

  composeNotification() {
    if (!this.title.trim() || !this.body.trim()) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      title: this.title,
      body: this.body,
      group: this.recipient,
      status: this.status,
      date: dateStr,
      time: timeStr
    });

    this.title = '';
    this.body = '';
    this.isComposeOpen = false;
  }

  removeNotif(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }
}
