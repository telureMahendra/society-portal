import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandingService } from '../../core/branding/branding.service';
import { SocietyBranding } from '../../core/models/branding.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <header class="dashboard-header animate-up">
        <div class="header-text">
          <h1>Welcome back, <span>Admin</span></h1>
          <p>Here's what's happening in <strong>{{ branding?.name || 'your society' }}</strong> today.</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary"><i class="fas fa-plus"></i> New Event</button>
          <button class="btn btn-primary"><i class="fas fa-file-invoice"></i> Create Bill</button>
        </div>
      </header>

      <div class="stats-grid animate-up delay-1">
        <div class="stat-card glass-card">
          <div class="card-icon residents"><i class="fas fa-users"></i></div>
          <div class="card-content">
            <h3>Total Residents</h3>
            <p class="value">1,284</p>
            <span class="trend positive"><i class="fas fa-arrow-up"></i> 12% from last month</span>
          </div>
        </div>

        <div class="stat-card glass-card">
          <div class="card-icon bills"><i class="fas fa-money-bill-wave"></i></div>
          <div class="card-content">
            <h3>Collected Bills</h3>
            <p class="value">₹ 8.4L</p>
            <span class="trend positive"><i class="fas fa-arrow-up"></i> 8% collected</span>
          </div>
        </div>

        <div class="stat-card glass-card">
          <div class="card-icon notices"><i class="fas fa-bullhorn"></i></div>
          <div class="card-content">
            <h3>Active Notices</h3>
            <p class="value">08</p>
            <span class="trend"><i class="fas fa-clock"></i> 2 expiring soon</span>
          </div>
        </div>

        <div class="stat-card glass-card">
          <div class="card-icon visitors"><i class="fas fa-shield-alt"></i></div>
          <div class="card-content">
            <h3>Visitors Today</h3>
            <p class="value">42</p>
            <span class="trend active">Currently in-premises</span>
          </div>
        </div>
      </div>

      <div class="content-grid animate-up delay-2">
        <div class="main-card glass-card">
          <div class="card-header">
            <h2>Recent Activity</h2>
            <button class="link-btn">View All</button>
          </div>
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-marker notice"></div>
              <div class="activity-info">
                <p><strong>General Meeting</strong> scheduled for Sunday</p>
                <span>2 hours ago</span>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-marker bill"></div>
              <div class="activity-info">
                <p><strong>Monthly Maintenance</strong> bills generated for Block A</p>
                <span>5 hours ago</span>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-marker user"></div>
              <div class="activity-info">
                <p>New resident registered in <strong>Flat 502</strong></p>
                <span>Yesterday</span>
              </div>
            </div>
          </div>
        </div>

        <div class="side-card glass-card">
          <div class="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div class="action-buttons">
            <button class="action-btn"><i class="fas fa-user-plus"></i> Add Resident</button>
            <button class="action-btn"><i class="fas fa-exclamation-circle"></i> Post Notice</button>
            <button class="action-btn"><i class="fas fa-cog"></i> Society Settings</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;

      h1 {
        font-size: 2.25rem;
        font-weight: 800;
        margin: 0;
        letter-spacing: -0.02em;

        span {
          color: var(--primary-color, #2563eb);
        }
      }

      p {
        color: #64748b;
        margin-top: 0.5rem;
        font-size: 1.1rem;
      }
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      border: none;

      &.btn-primary {
        background: var(--primary-color, #2563eb);
        color: white;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
        }
      }

      &.btn-secondary {
        background: white;
        color: #1e293b;
        border: 1px solid #e2e8f0;
        
        &:hover {
          background: #f8fafc;
        }
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 2rem;
      border: 1px solid rgba(255,255,255,0.4);
    }

    .card-icon {
      width: 60px;
      height: 60px;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;

      &.residents { background: rgba(37, 99, 235, 0.1); color: #2563eb; }
      &.bills { background: rgba(16, 185, 129, 0.1); color: #10b981; }
      &.notices { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
      &.visitors { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
    }

    .card-content {
      h3 {
        font-size: 0.875rem;
        color: #64748b;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 700;
      }

      .value {
        font-size: 1.75rem;
        font-weight: 800;
        margin: 0.25rem 0;
        color: #1e293b;
      }

      .trend {
        font-size: 0.8125rem;
        color: #64748b;
        display: flex;
        align-items: center;
        gap: 0.25rem;

        &.positive { color: #10b981; font-weight: 600; }
        &.active { color: #6366f1; font-weight: 600; }
      }
    }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h2 {
        font-size: 1.25rem;
        font-weight: 800;
        margin: 0;
      }

      .link-btn {
        background: none;
        border: none;
        color: var(--primary-color, #2563eb);
        font-weight: 600;
        cursor: pointer;
      }
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .activity-item {
      display: flex;
      gap: 1rem;
      align-items: start;

      .activity-marker {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-top: 0.5rem;
        flex-shrink: 0;

        &.notice { background: #f59e0b; }
        &.bill { background: #10b981; }
        &.user { background: #2563eb; }
      }

      .activity-info {
        p { margin: 0; color: #334155; }
        span { font-size: 0.8125rem; color: #94a3b8; }
      }
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .action-btn {
      width: 100%;
      padding: 1rem;
      border: 1px solid #e2e8f0;
      background: white;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 600;
      color: #1e293b;
      cursor: pointer;
      transition: all 0.2s;

      i { color: #64748b; }

      &:hover {
        border-color: var(--primary-color, #2563eb);
        color: var(--primary-color, #2563eb);
        background: rgba(37, 99, 235, 0.02);
        
        i { color: var(--primary-color, #2563eb); }
      }
    }

    /* Animations from landing */
    .animate-up {
      animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
      opacity: 0;
    }

    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      border-radius: 1.25rem;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }
  `]
})
export class DashboardComponent implements OnInit {
  branding: SocietyBranding | null = null;

  constructor(private brandingService: BrandingService) { }

  ngOnInit(): void {
    this.brandingService.branding$.subscribe(branding => {
      this.branding = branding;
    });
  }
}
