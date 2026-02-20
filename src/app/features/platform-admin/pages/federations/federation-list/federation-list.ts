import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlatformService, Federation } from '../../../services/platform';

@Component({
  selector: 'app-federation-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './federation-list.html',
  styleUrl: './federation-list.scss',
})
export class FederationList implements OnInit {
  federations: Federation[] = [];
  filteredFederations: Federation[] = [];
  isLoading = true;
  searchTerm = '';
  statusFilter = 'ALL';

  constructor(private platformService: PlatformService) { }

  ngOnInit() {
    this.loadFederations();
  }

  loadFederations() {
    this.isLoading = true;
    this.platformService.getFederations(0, 50, this.statusFilter).subscribe({
      next: (response) => {
        // Assuming response is paginated or direct list
        this.federations = response.content || response;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        // Fallback mock data
        this.federations = [
          { id: 1, name: 'Western Federation', code: 'WF01', subdomain: 'western', status: 'ACTIVE', createdAt: '2023-01-15', societiesCount: 12 },
          { id: 2, name: 'Northern Alliance', code: 'NA05', subdomain: 'north', status: 'ACTIVE', createdAt: '2023-03-22', societiesCount: 8 },
          { id: 3, name: 'Southern Collective', code: 'SC10', subdomain: 'south', status: 'INACTIVE', createdAt: '2023-06-10', societiesCount: 4 }
        ];
        this.applyFilters();
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    this.filteredFederations = this.federations.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        f.code.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.statusFilter === 'ALL' || f.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  onFilterChange() {
    this.loadFederations();
  }

  openCreateModal() {
    // To be implemented: Modal integration
    console.log('Open Create Federation Modal');
  }

  toggleStatus(federation: Federation) {
    const newStatus = federation.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    // this.platformService.updateFederationStatus(federation.id, newStatus)...
    federation.status = newStatus;
  }
}
