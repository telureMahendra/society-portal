import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-platform-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="platform-header">
      <div class="header-left">
        <button class="toggle-btn" (click)="toggleSidebar.emit()">
          <i class="fas fa-bars"></i>
        </button>
        <div class="brand">
          <span class="platform-name">EstatePilot</span>
          <span class="badge">Admin</span>
        </div>
      </div>
      
      <div class="header-right">
        <div class="user-profile" *ngIf="authService.currentUser$ | async as user">
          <div class="user-info">
            <span class="user-name">{{ user.username }}</span>
            <span class="user-role">{{ user.roles[0] }}</span>
          </div>
          <button class="logout-btn" (click)="logout()">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .platform-header {
      height: 64px;
      background-color: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1.5rem;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .toggle-btn {
      background: none;
      border: none;
      font-size: 1.25rem;
      color: #64748b;
      cursor: pointer;
      display: none; /* Hidden on desktop by default unless implementing collapse */
      
      @media (max-width: 768px) {
        display: block;
      }
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .platform-name {
      font-weight: 700;
      font-size: 1.25rem;
      color: #1e293b;
    }

    .badge {
      background-color: #f1f5f9;
      color: #475569;
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .header-right {
      display: flex;
      align-items: center;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      text-align: right;
      display: flex;
      flex-direction: column;
      
      @media (max-width: 640px) {
        display: none;
      }
    }

    .user-name {
      font-weight: 600;
      color: #334155;
      font-size: 0.875rem;
    }

    .user-role {
      font-size: 0.75rem;
      color: #64748b;
    }

    .logout-btn {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      font-size: 1rem;
      padding: 0.5rem;
      transition: color 0.2s;
      
      &:hover {
        color: #ef4444;
      }
    }
  `]
})
export class PlatformHeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
  }
}
