import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformAdminService, PlatformDashboardSummary } from '../../services/platform-admin.service';
import { Observable, catchError, of } from 'rxjs';
import { ApiError } from '../../../../core/interceptors/api-error.interceptor';

@Component({
    selector: 'app-platform-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="dashboard-container">
      <h1 class="page-title">Platform Overview</h1>
      
      <div class="stats-grid" *ngIf="summary$ | async as summary">
        <div class="stat-card">
          <div class="stat-icon federations">
            <i class="fas fa-building"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ summary.totalFederations }}</div>
            <div class="stat-label">Total Federations</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon societies">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ summary.totalSocieties }}</div>
            <div class="stat-label">Total Societies</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon users">
            <i class="fas fa-user-friends"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ summary.totalActiveUsers }}</div>
            <div class="stat-label">Active Users</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon flats">
            <i class="fas fa-home"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ summary.totalActiveFlats }}</div>
            <div class="stat-label">Active Flats</div>
          </div>
        </div>

        <div class="stat-card health-card" [ngClass]="summary.platformHealthStatus.toLowerCase()">
          <div class="stat-icon health">
            <i class="fas fa-heartbeat"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ summary.platformHealthStatus }}</div>
            <div class="stat-label">System Health</div>
          </div>
        </div>
      </div>

      <div class="loading-state" *ngIf="!(summary$ | async)">
        <i class="fas fa-spinner fa-spin"></i> Loading dashboard data...
      </div>

      <div class="error-state" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>
    </div>
  `,
    styles: [`
    .dashboard-container {
      padding-bottom: 2rem;
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 1.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: #ffffff;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      transition: transform 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .stat-icon.federations { background-color: #e0f2fe; color: #0284c7; }
    .stat-icon.societies { background-color: #f0fdf4; color: #16a34a; }
    .stat-icon.users { background-color: #fef9c3; color: #ca8a04; }
    .stat-icon.flats { background-color: #f3e8ff; color: #9333ea; }
    .stat-icon.health { background-color: #fee2e2; color: #dc2626; }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.2;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #64748b;
      margin-top: 0.25rem;
    }

    .health-card.healthy .stat-icon.health { background-color: #dcfce7; color: #16a34a; }
    .health-card.healthy .stat-value { color: #16a34a; }

    .health-card.degraded .stat-icon.health { background-color: #fef9c3; color: #ca8a04; }
    .health-card.degraded .stat-value { color: #ca8a04; }

    .health-card.down .stat-icon.health { background-color: #fee2e2; color: #dc2626; }
    .health-card.down .stat-value { color: #dc2626; }

    .loading-state {
      text-align: center;
      padding: 3rem;
      color: #64748b;
      font-size: 1.1rem;
    }

    .error-state {
      margin-top: 1rem;
      border: 1px solid #fecaca;
      background: #fee2e2;
      color: #991b1b;
      border-radius: 0.5rem;
      padding: 0.75rem 1rem;
    }
  `]
})
export class PlatformDashboardComponent implements OnInit {
    private platformService = inject(PlatformAdminService);
    summary$: Observable<PlatformDashboardSummary> | undefined;
    errorMessage = '';

    ngOnInit() {
        this.summary$ = this.platformService.getDashboardSummary().pipe(
            catchError((error: ApiError) => {
                this.errorMessage = `Failed to load dashboard: ${error.message}`;
                return of<PlatformDashboardSummary>({
                    totalFederations: 0,
                    totalSocieties: 0,
                    totalActiveUsers: 0,
                    totalActiveFlats: 0,
                    platformHealthStatus: 'DEGRADED'
                });
            })
        );
    }
}
