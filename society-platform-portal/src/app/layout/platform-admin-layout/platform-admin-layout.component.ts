import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlatformHeaderComponent } from './platform-header.component';
import { PlatformSidebarComponent } from './platform-sidebar.component';

@Component({
    selector: 'app-platform-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, PlatformHeaderComponent, PlatformSidebarComponent],
    template: `
    <div class="platform-layout">
      <app-platform-header (toggleSidebar)="toggleSidebar()"></app-platform-header>
      
      <div class="layout-body">
        <div class="sidebar-wrapper" [class.open]="isSidebarOpen">
           <app-platform-sidebar></app-platform-sidebar>
        </div>
        <div class="sidebar-backdrop" *ngIf="isSidebarOpen" (click)="toggleSidebar()"></div>

        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
    styles: [`
    .platform-layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background-color: #f8fafc; /* Light gray background */
    }

    .layout-body {
      display: flex;
      flex: 1;
      overflow: hidden;
      position: relative;
    }

    .sidebar-wrapper {
      width: 260px;
      flex-shrink: 0;
      height: 100%;
      transition: transform 0.3s ease;
      
      @media (max-width: 768px) {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 50;
        transform: translateX(-100%);
        background-color: #1e293b;
        
        &.open {
          transform: translateX(0);
        }
      }
    }

    .sidebar-backdrop {
      display: none;
      @media (max-width: 768px) {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 40;
      }
    }

    .main-content {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
    }
  `]
})
export class PlatformAdminLayoutComponent {
    isSidebarOpen = false;

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }
}
