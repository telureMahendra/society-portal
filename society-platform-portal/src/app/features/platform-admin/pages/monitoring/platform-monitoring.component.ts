import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformAdminService, MonitoringSummary } from '../../services/platform-admin.service';
import { Observable, catchError, of } from 'rxjs';
import { ApiError } from '../../../../core/interceptors/api-error.interceptor';

@Component({
  selector: 'app-platform-monitoring',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="monitoring-container">
      <h1 class="page-title">Platform Monitoring</h1>

      <div class="monitoring-content" *ngIf="monitoring$ | async as data">
        
        <!-- Status Overview -->
        <div class="status-section">
          <div class="status-card">
            <h3>Active Tenants</h3>
            <div class="big-number">{{ data.activeTenants }}</div>
          </div>
          <div class="status-card">
             <h3>API Health</h3>
             <div class="status-badge" [class.ok]="data.apiHealth === 'OK'" [class.error]="data.apiHealth !== 'OK'">
               {{ data.apiHealth }}
             </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="details-section">
           <div class="panel">
             <h2>Recent Onboardings</h2>
             <ul class="activity-list">
               <li *ngFor="let item of data.recentOnboardings">
                 <!-- Placeholder structure -->
                 <span class="activity-name">{{ item.name || 'New Society' }}</span>
                 <span class="activity-date">{{ item.date || 'Just now' }}</span>
               </li>
               <li *ngIf="!data.recentOnboardings.length" class="empty">No recent onboardings</li>
             </ul>
           </div>

           <div class="panel">
             <h2>System Alerts</h2>
             <ul class="alert-list">
               <li *ngFor="let alert of data.systemAlerts">
                 <span class="alert-msg">{{ alert.message || 'System alert' }}</span>
                 <span class="alert-severity" [class]="alert.severity || 'info'">{{ alert.severity || 'Info' }}</span>
               </li>
               <li *ngIf="!data.systemAlerts.length" class="empty">No active alerts</li>
             </ul>
           </div>
        </div>

      </div>

      <div class="loading-state" *ngIf="!(monitoring$ | async)">
        <i class="fas fa-spinner fa-spin"></i> Loading monitoring data...
      </div>

      <div class="error-state" *ngIf="errorMessage">{{ errorMessage }}</div>
    </div>
  `,
  styles: [`
    .monitoring-container {
      padding-bottom: 2rem;
    }
    
    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 1.5rem;
    }

    .status-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .status-card {
      background: white;
      padding: 1.5rem;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      
      h3 {
        margin: 0 0 0.5rem 0;
        color: #64748b;
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .big-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: #0f172a;
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-weight: 600;
      background: #f1f5f9;
      color: #475569;
      
      &.ok {
        background: #dcfce7;
        color: #16a34a;
      }
      
      &.error {
        background: #fee2e2;
        color: #dc2626;
      }
    }

    .details-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .panel {
      background: white;
      padding: 1.5rem;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      
      h2 {
        font-size: 1.1rem;
        margin-top: 0;
        margin-bottom: 1rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid #e2e8f0;
        color: #334155;
      }
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      padding: 0.75rem 0;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      
      &:last-child {
        border-bottom: none;
      }
    }

    .empty {
      color: #94a3b8;
      font-style: italic;
    }

    .loading-state {
      text-align: center;
      padding: 3rem;
      color: #64748b;
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
export class PlatformMonitoringComponent implements OnInit {
  private platformService = inject(PlatformAdminService);
  monitoring$: Observable<MonitoringSummary> | undefined;
  errorMessage = '';

  ngOnInit() {
    this.monitoring$ = this.platformService.getMonitoringSummary().pipe(
      catchError((error: ApiError) => {
        this.errorMessage = `Failed to load monitoring summary: ${error.message}`;
        return of({
          activeTenants: 0,
          apiHealth: 'DOWN',
          recentOnboardings: [],
          systemAlerts: []
        });
      })
    );
  }
}
