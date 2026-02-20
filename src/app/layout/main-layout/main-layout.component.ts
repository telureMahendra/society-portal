import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent, FooterComponent],
    template: `
    <div class="layout-wrapper">
      <app-header></app-header>
      <div class="content-wrapper">
        <app-sidebar class="sidebar"></app-sidebar>
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
      <app-footer></app-footer>
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
    }

    .sidebar {
      flex: 0 0 250px;
      /* Hidden on mobile, can add media queries later */
      @media (max-width: 768px) {
        display: none; 
      }
    }

    .main-content {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
      background-color: var(--background-color, #f4f6f8);
    }
  `]
})
export class MainLayoutComponent { }
