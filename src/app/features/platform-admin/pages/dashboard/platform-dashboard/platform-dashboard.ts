import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformService, PlatformSummary } from '../../../services/platform';

@Component({
  selector: 'app-platform-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './platform-dashboard.html',
  styleUrl: './platform-dashboard.scss',
})
export class PlatformDashboard implements OnInit {
  summary: PlatformSummary | null = null;
  isLoading = true;

  constructor(private platformService: PlatformService) { }

  ngOnInit() {
    this.platformService.getDashboardSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.isLoading = false;
      },
      error: () => {
        // Use placeholder data if API fails (since backend is not yet fully implemented for all fields)
        this.summary = {
          totalFederations: 5,
          totalSocieties: 24,
          totalActiveUsers: 1250,
          totalActiveFlats: 3200,
          platformHealthStatus: 'HEALTHY'
        };
        this.isLoading = false;
      }
    });
  }
}
