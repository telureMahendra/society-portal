import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandingService } from '../../core/branding/branding.service';
import { AuthService } from '../../core/auth/auth.service';
import { SocietyBranding } from '../../core/models/branding.model';
import { User } from '../../core/auth/auth.service';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header" [class.scrolled]="isScrolled">
      <div class="header-left">
        <button (click)="toggleSidebar()" class="menu-toggle" title="Toggle Sidebar">
          <i class="fas fa-bars"></i>
        </button>
        <div class="brand" *ngIf="branding" (click)="goToDashboard()">
          <div class="logo-container glass-card">
            <img [src]="branding.logoUrl" alt="Logo" class="logo">
          </div>
          <div class="brand-info">
            <span class="brand-name">{{ branding.name }}</span>
            <span class="portal-label">Society Management</span>
          </div>
        </div>
      </div>

      <div class="header-center">
        <div class="search-bar glass-card">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Search for flats, residents, or bills...">
          <div class="search-shortcut">/</div>
        </div>
      </div>

      <div class="header-right">
        <div class="action-icons">
          <div class="icon-wrapper glass-card" title="Notifications">
            <i class="far fa-bell"></i>
            <span class="notification-badge">3</span>
          </div>
          <div class="icon-wrapper glass-card" title="Settings">
            <i class="fas fa-cog"></i>
          </div>
        </div>

        <div class="user-dropdown" *ngIf="user" [class.open]="showUserMenu" (click)="toggleUserMenu()">
          <div class="user-profile glass-card">
            <div class="avatar-wrapper">
              <img *ngIf="user.profileImageUrl" [src]="user.profileImageUrl" [alt]="user.username">
              <div *ngIf="!user.profileImageUrl" class="initial">
                {{ user.username.charAt(0).toUpperCase() }}
              </div>
            </div>
            <div class="user-info">
              <span class="username">{{ user.username }}</span>
              <span class="role">Society Admin</span>
            </div>
            <i class="fas fa-chevron-down toggle-icon"></i>
          </div>

          <div class="dropdown-menu glass-card animate-up" *ngIf="showUserMenu">
            <a href="#" class="menu-item"><i class="far fa-user"></i> My Profile</a>
            <a href="#" class="menu-item"><i class="fas fa-shield-alt"></i> Security</a>
            <div class="menu-divider"></div>
            <button (click)="logout()" class="menu-item logout"><i class="fas fa-sign-out-alt"></i> Logout</button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      display: grid; grid-template-columns: 300px 1fr 300px; align-items: center;
      padding: 0 1.5rem; height: 72px;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(226, 232, 240, 0.8);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      @media (max-width: 1024px) { grid-template-columns: auto 1fr auto; padding: 0 1rem; }
    }

    .app-header.scrolled {
      background: rgba(255, 255, 255, 0.9);
      height: 64px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);
    }

    .header-left { display: flex; align-items: center; gap: 1.5rem; }

    .menu-toggle {
      width: 40px; height: 40px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      background: #f8fafc; border: 1px solid #e2e8f0; color: #1e293b;
      cursor: pointer; transition: all 0.2s;
      &:hover { background: #f1f5f9; color: #2563eb; transform: scale(1.05); }
    }

    .brand {
      display: flex; align-items: center; gap: 0.75rem; cursor: pointer;
      .logo-container { width: 40px; height: 40px; padding: 4px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
      .logo { height: 100%; width: auto; object-fit: contain; }
      .brand-info {
        display: flex; flex-direction: column;
        .brand-name { font-size: 1rem; font-weight: 800; color: #1e293b; line-height: 1.2; letter-spacing: -0.01em; }
        .portal-label { font-size: 0.65rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
      }
    }

    .header-center {
      display: flex; justify-content: center; padding: 0 2rem;
      @media (max-width: 768px) { display: none; }
    }

    .search-bar {
      width: 100%; max-width: 500px; display: flex; align-items: center;
      padding: 0.625rem 1rem; background: rgba(241, 245, 249, 0.8) !important;
      border: 1px solid transparent; transition: all 0.2s;
      &:focus-within { background: white !important; border-color: #2563eb; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08); }
      i { color: #94a3b8; margin-right: 0.75rem; }
      input { flex: 1; border: none; background: none; outline: none; font-size: 0.875rem; color: #1e293b; font-weight: 500; &::placeholder { color: #94a3b8; } }
      .search-shortcut { padding: 2px 6px; background: white; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 0.65rem; font-weight: 700; color: #94a3b8; }
    }

    .header-right { display: flex; align-items: center; gap: 1rem; justify-content: flex-end; }

    .action-icons {
      display: flex; gap: 0.75rem;
      .icon-wrapper {
        width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
        color: #64748b; cursor: pointer; position: relative; transition: all 0.2s;
        &:hover { background: #f8fafc !important; color: #2563eb; }
        .notification-badge { position: absolute; top: -2px; right: -2px; width: 18px; height: 18px; background: #ef4444; color: white; border: 2px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.625rem; font-weight: 800; }
      }
    }

    .user-dropdown {
      position: relative;
      .user-profile {
        display: flex; align-items: center; gap: 0.75rem; padding: 4px 8px 4px 4px !important;
        cursor: pointer; transition: all 0.2s;
        &:hover { background: #f8fafc !important; }
        .avatar-wrapper {
          width: 32px; height: 32px; border-radius: 10px; overflow: hidden; background: #2563eb; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem;
          img { width: 100%; height: 100%; object-fit: cover; }
        }
        .user-info {
          display: flex; flex-direction: column;
          @media (max-width: 1200px) { display: none; }
          .username { font-size: 0.8125rem; font-weight: 700; color: #1e293b; }
          .role { font-size: 0.65rem; font-weight: 600; color: #64748b; }
        }
        .toggle-icon { font-size: 0.75rem; color: #94a3b8; margin-left: 4px; transition: transform 0.3s; }
      }
      &.open .toggle-icon { transform: rotate(180deg); }
    }

    .dropdown-menu {
      position: absolute; top: calc(100% + 12px); right: 0; width: 220px;
      padding: 0.5rem !important; display: flex; flex-direction: column; gap: 2px;
      z-index: 1001; background: rgba(255, 255, 255, 0.98) !important;
      .menu-item {
        display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem;
        border-radius: 8px; color: #475569; font-size: 0.875rem; font-weight: 600; text-decoration: none; border: none; background: none; width: 100%; text-align: left; cursor: pointer; transition: all 0.2s;
        i { font-size: 0.9rem; color: #94a3b8; width: 16px; }
        &:hover { background: #f1f5f9; color: #1e293b; i { color: #2563eb; } }
        &.logout { color: #ef4444; &:hover { background: #fef2f2; i { color: #ef4444; } } }
      }
      .menu-divider { height: 1px; background: #e2e8f0; margin: 4px 0; }
    }

    .glass-card { background: rgba(255, 255, 255, 0.4); border-radius: 12px; border: 1px solid rgba(226, 232, 240, 0.6); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .animate-up { animation: fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class HeaderComponent implements OnInit {
  branding: SocietyBranding | null = null;
  user: any | null = null;
  showUserMenu = false;
  isScrolled = false;

  constructor(
    private brandingService: BrandingService,
    private authService: AuthService,
    private sidebarService: SidebarService
  ) { }

  ngOnInit() {
    this.brandingService.branding$.subscribe(b => this.branding = b);
    this.authService.currentUser$.subscribe(u => this.user = u);

    window.addEventListener('scroll', () => {
      this.isScrolled = window.scrollY > 20;
    });
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  goToDashboard() {
    // Navigation logic here
  }

  logout() {
    this.authService.logout();
  }
}
