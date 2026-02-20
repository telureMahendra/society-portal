import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandingService } from '../../core/branding/branding.service';
import { AuthService } from '../../core/auth/auth.service';
import { SocietyBranding } from '../../core/models/branding.model';
import { User } from '../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header" [style.backgroundColor]="branding?.theme?.primaryColor">
      <div class="header-left">
        <button class="menu-toggle">☰</button>
        <div class="brand" *ngIf="branding">
          <img [src]="branding.logoUrl" alt="Logo" class="logo">
          <span class="brand-name">{{ branding.name }}</span>
        </div>
      </div>
      <div class="header-right">
        <div class="user-profile" *ngIf="user">
          <span class="username">{{ user.username }}</span>
          <!-- Assuming dummy avatar or initial -->
          <div class="avatar">{{ user.username.charAt(0).toUpperCase() }}</div>
        </div>
        <button (click)="logout()" class="logout-btn">Logout</button>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem;
      height: 64px;
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .menu-toggle {
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .logo {
        height: 40px;
        width: auto;
      }

      .brand-name {
        font-size: 1.25rem;
        font-weight: bold;
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .avatar {
        width: 32px;
        height: 32px;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
      }
    }

    .logout-btn {
      background: none;
      border: 1px solid rgba(255,255,255,0.5);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      cursor: pointer;
      
      &:hover {
        background: rgba(255,255,255,0.1);
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  branding: SocietyBranding | null = null;
  user: User | null = null;

  constructor(
    private brandingService: BrandingService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.brandingService.branding$.subscribe(b => this.branding = b);
    this.authService.currentUser$.subscribe((u: User | null) => this.user = u);
  }

  logout() {
    this.authService.logout();
  }
}
