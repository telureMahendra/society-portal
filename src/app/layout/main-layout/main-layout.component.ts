import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { SidebarService } from '../../core/services/sidebar.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent, FooterComponent],
  template: `
    <div class="layout-wrapper" [class.sidebar-collapsed]="!(sidebarService.isOpen$ | async)">
      <app-header></app-header>
      <div class="content-wrapper">
        <app-sidebar class="sidebar"></app-sidebar>
        <main class="main-content">
          <div class="page-content">
            <router-outlet></router-outlet>
          </div>
          <app-footer></app-footer>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    .content-wrapper {
      display: flex;
      flex: 1;
      overflow: hidden;
      margin-top: 72px; /* Match header height */
    }

    .sidebar {
      flex: 0 0 250px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      @media (max-width: 768px) {
        position: fixed;
        left: -250px;
        top: 72px;
        bottom: 0;
        z-index: 150;
        box-shadow: 4px 0 10px rgba(0,0,0,0.1);
      }
    }

    .sidebar-collapsed .sidebar {
      margin-left: -250px;
      
      @media (max-width: 768px) {
        left: 0;
        margin-left: 0;
      }
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      background-color: var(--background-color, #f8fafc);
      transition: all 0.3s ease;
      padding: 0;
    }

    .page-content {
      flex: 1;
      padding: 2.5rem;
    }
  `]
})
export class MainLayoutComponent {
  sidebarService = inject(SidebarService);
}
