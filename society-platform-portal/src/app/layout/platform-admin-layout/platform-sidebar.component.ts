import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-platform-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <aside class="platform-sidebar">
      <nav class="sidebar-nav">
        <ul>
          <li>
            <a routerLink="/platform/dashboard" routerLinkActive="active">
              <i class="fas fa-home"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a routerLink="/platform/federations" routerLinkActive="active">
              <i class="fas fa-building"></i>
              <span>Federations</span>
            </a>
          </li>
          <li>
            <a routerLink="/platform/societies" routerLinkActive="active">
              <i class="fas fa-users"></i>
              <span>Societies</span>
            </a>
          </li>
          <li>
            <a routerLink="/platform/subdomains" routerLinkActive="active">
              <i class="fas fa-globe"></i>
              <span>Subdomains</span>
            </a>
          </li>
          <li>
            <a routerLink="/platform/monitoring" routerLinkActive="active">
              <i class="fas fa-chart-line"></i>
              <span>Monitoring</span>
            </a>
          </li>
        </ul>
      </nav>
      
      <div class="sidebar-footer">
        <span class="version">v1.0.0</span>
      </div>
    </aside>
  `,
    styles: [`
    .platform-sidebar {
      height: 100%;
      background-color: #1e293b; /* Dark slate */
      color: #cbd5e1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      margin-bottom: 0.25rem;
    }

    a {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.5rem;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.95rem;
      transition: all 0.2s;
      border-left: 3px solid transparent;

      &:hover {
        background-color: #334155;
        color: #f1f5f9;
      }

      &.active {
        background-color: #334155;
        color: #38bdf8; /* Sky blue */
        border-left-color: #38bdf8;
      }

      i {
        width: 20px;
        text-align: center;
        font-size: 1.1rem;
      }
    }

    .sidebar-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #334155;
      font-size: 0.75rem;
      color: #64748b;
      text-align: center;
    }
  `]
})
export class PlatformSidebarComponent { }
