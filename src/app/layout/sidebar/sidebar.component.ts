import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="app-sidebar">
      <nav>
        <ul class="nav-menu">
          <li>
            <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <i class="fas fa-th-large"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a routerLink="/billing" routerLinkActive="active">
              <i class="fas fa-file-invoice-dollar"></i>
              <span>Bills</span>
            </a>
          </li>
          <li>
            <a routerLink="/payments" routerLinkActive="active">
              <i class="fas fa-history"></i>
              <span>Payments</span>
            </a>
          </li>
          <li>
            <a routerLink="/notices" routerLinkActive="active">
              <i class="fas fa-bullhorn"></i>
              <span>Notices</span>
            </a>
          </li>
          <li>
            <a routerLink="/events" routerLinkActive="active">
              <i class="fas fa-calendar-alt"></i>
              <span>Events</span>
            </a>
          </li>
          <li>
            <a routerLink="/units" routerLinkActive="active">
              <i class="fas fa-building"></i>
              <span>Units</span>
            </a>
          </li>
          <li>
            <a routerLink="/members" routerLinkActive="active">
              <i class="fas fa-users"></i>
              <span>Members</span>
            </a>
          </li>

          <!-- Redevelopment with Submenu -->
          <li class="submenu-container">
            <button (click)="toggleRedevelopmentMenu()" class="submenu-toggle">
              <i class="fas fa-tools"></i>
              <span>Redevelopment</span>
              <i class="fas fa-chevron-down submenu-chevron" [class.rotated]="isRedevelopmentOpen()"></i>
            </button>
            <ul class="submenu" *ngIf="isRedevelopmentOpen()">
              <li>
                <a routerLink="/redevelopment/management-committee" routerLinkActive="active" class="submenu-item">
                  <i class="fas fa-users"></i>
                  <span>Management Committee</span>
                </a>
              </li>
              <li>
                <a routerLink="/redevelopment/committee" routerLinkActive="active" class="submenu-item">
                  <i class="fas fa-user-hard-hat"></i>
                  <span>Redevelopment Committee</span>
                </a>
              </li>
              <li>
                <a routerLink="/redevelopment/documents" routerLinkActive="active" class="submenu-item">
                  <i class="fas fa-file-alt"></i>
                  <span>Documents</span>
                </a>
              </li>
              <li>
                <a routerLink="/redevelopment/notifications" routerLinkActive="active" class="submenu-item">
                  <i class="fas fa-bell"></i>
                  <span>Notifications</span>
                </a>
              </li>
            </ul>
          </li>

          <li>
            <a routerLink="/visitors" routerLinkActive="active">
              <i class="fas fa-user-shield"></i>
              <span>Visitors</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  `,
  styles: [`
    .app-sidebar {
      width: 250px;
      background-color: #ffffff;
      border-right: 1px solid #e2e8f0;
      height: 100%;
      padding: 1.5rem 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    nav {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .nav-menu {
      list-style: none;
      padding: 0 1rem 3rem 1rem;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .nav-menu li a {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1.25rem;
      color: #64748b;
      text-decoration: none;
      border-radius: 0.75rem;
      font-weight: 500;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      
      i {
        font-size: 1.1rem;
        width: 24px;
        text-align: center;
      }

      &:hover {
        background-color: #f1f5f9;
        color: var(--primary-color, #2563eb);
        transform: translateX(4px);
      }

      &.active {
        background-color: rgba(37, 99, 235, 0.1);
        color: var(--primary-color, #2563eb);
        
        i {
          color: var(--primary-color, #2563eb);
        }
      }
    }

    .submenu-container {
      position: relative;
    }

    .submenu-toggle {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1.25rem;
      width: 100%;
      border: none;
      background: transparent;
      color: #64748b;
      font-weight: 500;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

      i {
        font-size: 1.1rem;
        width: 24px;
        text-align: center;
      }

      &:hover {
        background-color: #f1f5f9;
        color: var(--primary-color, #2563eb);
      }
    }

    .submenu-chevron {
      margin-left: auto;
      transition: transform 0.2s ease;
      font-size: 0.8rem;

      &.rotated {
        transform: rotate(180deg);
      }
    }

    .submenu {
      list-style: none;
      margin: 0;
      padding: 0.5rem 0;
      background-color: #f8fafc;
      border-radius: 0.5rem;
      margin-left: 1rem;
      margin-right: 1rem;
      margin-top: 0.25rem;
      overflow: visible;
      animation: slideDown 0.2s ease-out;
      position: relative;
      z-index: 10;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .submenu-item {
      display: flex !important;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.25rem;
      color: #64748b;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      text-decoration: none;
      transition: all 0.2s ease;
      margin: 0 0.5rem;

      i {
        font-size: 0.95rem;
        width: 20px;
      }

      &:hover {
        background-color: #e2e8f0;
        color: var(--primary-color, #2563eb);
        transform: translateX(3px);
      }

      &.active {
        background-color: rgba(37, 99, 235, 0.15);
        color: var(--primary-color, #2563eb);
        font-weight: 600;

        i {
          color: var(--primary-color, #2563eb);
        }
      }
    }
  `]
})
export class SidebarComponent {
  isRedevelopmentOpen = signal(false);

  toggleRedevelopmentMenu() {
    this.isRedevelopmentOpen.update(value => !value);
  }
}
