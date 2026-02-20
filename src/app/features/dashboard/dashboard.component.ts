import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="dashboard">
      <h1>Dashboard</h1>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Residents</h3>
          <p class="value">124</p>
        </div>
        <div class="stat-card">
          <h3>Pending Bills</h3>
          <p class="value">₹ 45,200</p>
        </div>
        <div class="stat-card">
          <h3>Active Notices</h3>
          <p class="value">3</p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .dashboard {
      padding: 1rem;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      border-left: 4px solid var(--primary-color, #3f51b5);

      h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        color: #666;
      }

      .value {
        margin: 0;
        font-size: 1.5rem;
        font-weight: bold;
        color: #333;
      }
    }
  `]
})
export class DashboardComponent { }
