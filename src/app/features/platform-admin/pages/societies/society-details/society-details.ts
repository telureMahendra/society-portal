import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PlatformAdminService, Society } from '../../../services/platform-admin.service';
import { ApiError } from '../../../../../core/interceptors/api-error.interceptor';

@Component({
  selector: 'app-society-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './society-details.html',
  styleUrl: './society-details.scss',
})
export class SocietyDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private platformService = inject(PlatformAdminService);

  society: Society | null = null;
  loading = true;
  error = '';
  activeTab = 'overview';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadSocietyDetails(Number(id));
      } else {
        this.error = 'Invalid society ID.';
        this.loading = false;
      }
    });
  }

  loadSocietyDetails(id: number) {
    this.loading = true;
    this.error = '';
    this.platformService.getSociety(id).subscribe({
      next: (data) => {
        this.society = data;
        this.loading = false;
      },
      error: (err: ApiError) => {
        this.error = 'Failed to load society details: ' + err.message;
        this.loading = false;
      }
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  goBack() {
    this.router.navigate(['/platform/societies']);
  }

  getStatusClass(status?: string): string {
    if (!status) return 'unknown';
    const normalized = status.toLowerCase();
    return ['active', 'inactive', 'draft'].includes(normalized) ? normalized : 'unknown';
  }
}
