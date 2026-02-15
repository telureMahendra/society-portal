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
        <ul>
          <li><a routerLink="/dashboard" routerLinkActive="active">Dashboard</a></li>
          <li><a routerLink="/bills" routerLinkActive="active">Bills</a></li>
          <li><a routerLink="/payments" routerLinkActive="active">Payments</a></li>
          <li><a routerLink="/notices" routerLinkActive="active">Notices</a></li>
          <li><a routerLink="/events" routerLinkActive="active">Events</a></li>
        </ul>
      </nav>
    </aside>
  `,
    styles: [`
    .app-sidebar {
      width: 250px;
      background-color: #fff;
      border-right: 1px solid #ddd;
      height: calc(100vh - 64px); /* Subtract header height */
      overflow-y: auto;
      padding: 1rem 0;
    }

    nav ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    nav li a {
      display: block;
      padding: 0.75rem 1.5rem;
      color: #333;
      text-decoration: none;
      transition: background-color 0.2s;
      
      &:hover {
        background-color: #f5f5f5;
        color: var(--primary-color, #3f51b5);
      }

      &.active {
        background-color: rgba(var(--primary-color-rgb), 0.1); /* Fallback needs proper RGB generic handling or just opacity */
        background-color: #e3f2fd; /* Simplification */
        color: var(--primary-color, #3f51b5);
        border-right: 3px solid var(--primary-color, #3f51b5);
      }
    }
  `]
})
export class SidebarComponent { }
