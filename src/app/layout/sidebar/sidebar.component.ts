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
            <a routerLink="/bills" routerLinkActive="active">
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
  `]
})
export class SidebarComponent { }
