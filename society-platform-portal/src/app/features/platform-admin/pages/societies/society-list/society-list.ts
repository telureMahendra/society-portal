import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlatformService, Society } from '../../../services/platform';

@Component({
  selector: 'app-society-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './society-list.html',
  styleUrl: './society-list.scss',
})
export class SocietyList implements OnInit {
  societies: Society[] = [];
  filteredSocieties: Society[] = [];
  isLoading = true;

  searchTerm = '';
  federationFilter = 'ALL';
  cityFilter = 'ALL';
  statusFilter = 'ALL';

  cities: string[] = [];
  federations: string[] = [];

  constructor(private platformService: PlatformService) { }

  ngOnInit() {
    this.loadSocieties();
  }

  loadSocieties() {
    this.platformService.getSocieties().subscribe({
      next: (response) => {
        this.societies = response.content || response;
        this.extractFilterOptions();
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        // Fallback mock data
        this.societies = [
          { id: 1, name: 'Lodha Belmondo', federationName: 'Western Federation', subdomain: 'lodha', city: 'Pune', totalFlats: 1200, status: 'ACTIVE' },
          { id: 2, name: 'Roseland Residency', federationName: 'Western Federation', subdomain: 'roseland', city: 'Pune', totalFlats: 850, status: 'ACTIVE' },
          { id: 3, name: 'Northern heights', federationName: 'Northern Alliance', subdomain: 'heights', city: 'Delhi', totalFlats: 450, status: 'INACTIVE' }
        ];
        this.extractFilterOptions();
        this.applyFilters();
        this.isLoading = false;
      }
    });
  }

  extractFilterOptions() {
    this.cities = [...new Set(this.societies.map(s => s.city))];
    this.federations = [...new Set(this.societies.map(s => s.federationName))];
  }

  applyFilters() {
    this.filteredSocieties = this.societies.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        s.subdomain.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesFed = this.federationFilter === 'ALL' || s.federationName === this.federationFilter;
      const matchesCity = this.cityFilter === 'ALL' || s.city === this.cityFilter;
      const matchesStatus = this.statusFilter === 'ALL' || s.status === this.statusFilter;

      return matchesSearch && matchesFed && matchesCity && matchesStatus;
    });
  }

  onFilterChange() {
    this.applyFilters();
  }

  toggleStatus(society: Society) {
    const newStatus = society.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.platformService.updateSocietyStatus(society.id, newStatus).subscribe({
      next: () => society.status = newStatus,
      error: () => society.status = newStatus // For mock demo
    });
  }
}
