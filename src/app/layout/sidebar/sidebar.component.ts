import { Component } from '@angular/core';
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
            <a routerLink="/complaints" routerLinkActive="active">
              <i class="fas fa-exclamation-circle"></i>
              <span>Complaints</span>
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
          <li>
            <a routerLink="/visitors" routerLinkActive="active">
              <i class="fas fa-user-shield"></i>
              <span>Visitors</span>
            </a>
          </li>
          <li class="nav-group">
            <div class="nav-group-title" (click)="toggleConfiguration()">
              <div class="title-left">
                <i class="fas fa-cogs"></i>
                <span>Configuration</span>
              </div>
              <i class="fas" [ngClass]="isConfigurationOpen ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
            </div>
            <ul class="sub-menu" [class.open]="isConfigurationOpen">
              <li>
                <a routerLink="/complaint-categories" routerLinkActive="active">
                  <i class="fas fa-list-alt"></i>
                  <span>Complaint Categories</span>
                </a>
              </li>
              <li>
                <a routerLink="/configuration/payment" routerLinkActive="active">
                  <i class="fas fa-credit-card"></i>
                  <span>Payment Configuration</span>
                </a>
              </li>
            </ul>
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
      overflow-y: auto;
    }

    .nav-menu {
      list-style: none;
      padding: 0 1rem;
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

    .nav-group-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.875rem 1.25rem;
      color: #64748b;
      cursor: pointer;
      border-radius: 0.75rem;
      font-weight: 500;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .nav-group-title:hover {
      background-color: #f1f5f9;
      color: var(--primary-color, #2563eb);
    }

    .title-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .title-left i {
      font-size: 1.1rem;
      width: 24px;
      text-align: center;
    }

    .sub-menu {
      list-style: none;
      padding-left: 2.5rem;
      padding-right: 1rem;
      margin: 0;
      display: none;
      flex-direction: column;
      gap: 0.25rem;
    }

    .sub-menu.open {
      display: flex;
    }

    .sub-menu li a {
      padding: 0.75rem 1rem;
      font-size: 0.95rem;
    }
  `]
})
export class SidebarComponent {
  isConfigurationOpen = false;

  toggleConfiguration() {
    this.isConfigurationOpen = !this.isConfigurationOpen;
  }
}
