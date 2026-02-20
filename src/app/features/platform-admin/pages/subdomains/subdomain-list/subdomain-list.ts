import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlatformService, Subdomain } from '../../../services/platform';

@Component({
  selector: 'app-subdomain-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subdomain-list.html',
  styleUrl: './subdomain-list.scss',
})
export class SubdomainList implements OnInit {
  subdomains: Subdomain[] = [];
  isLoading = true;

  constructor(private platformService: PlatformService) { }

  ngOnInit() {
    this.loadSubdomains();
  }

  loadSubdomains() {
    this.platformService.getSubdomains().subscribe({
      next: (data) => {
        this.subdomains = data;
        this.isLoading = false;
      },
      error: () => {
        // Fallback mock data
        this.subdomains = [
          { subdomain: 'lodha', type: 'SOCIETY', linkedEntityName: 'Lodha Belmondo', status: 'ALLOCATED', createdAt: '2023-01-10' },
          { subdomain: 'western', type: 'FEDERATION', linkedEntityName: 'Western Federation', status: 'ALLOCATED', createdAt: '2023-01-05' },
          { subdomain: 'heights', type: 'SOCIETY', linkedEntityName: 'Northern Heights', status: 'PENDING', createdAt: '2023-06-15' },
          { subdomain: 'admin', type: 'SOCIETY', linkedEntityName: 'Conflict Test', status: 'CONFLICT', createdAt: '2023-07-01' }
        ];
        this.isLoading = false;
      }
    });
  }

  checkAvailability(subdomainStr: string) {
    // API call placeholder: GET /api/v1/platform/subdomains/check?name=...
    console.log('Checking availability for:', subdomainStr);
  }
}
