import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformAdminService, SubdomainInfo } from '../../services/platform-admin.service';
import { ApiError } from '../../../../core/interceptors/api-error.interceptor';

@Component({
  selector: 'app-subdomain-manager',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Subdomain Manager</h1>
      </div>

      <div class="error" *ngIf="errorMessage">{{ errorMessage }}</div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Subdomain</th>
              <th>Type</th>
              <th>Linked Entity</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="loading">
              <td colspan="5" class="text-center p-4">
                <i class="fas fa-spinner fa-spin"></i> Loading subdomains...
              </td>
            </tr>
            <ng-container *ngIf="!loading">
              <tr *ngFor="let item of subdomains">
              <td><span class="badge subdomain">{{ item.subdomain }}</span></td>
              <td>{{ item.type }}</td>
              <td>{{ item.linkedEntityName }}</td>
              <td>
                <span class="badge status" 
                      [class.active]="item.status === 'ACTIVE'"
                      [class.available]="item.status === 'Available'"
                      [class.reserved]="item.status === 'Reserved'">
                  {{ item.status }}
                </span>
              </td>
              <td>{{ item.createdAt | date:'mediumDate' }}</td>
            </tr>
            </ng-container>
             <tr *ngIf="subdomains.length === 0 && !loading">
              <td colspan="5" class="empty-state">No subdomains found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding-bottom: 2rem; }
    .page-header { margin-bottom: 1.5rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin: 0; }
    
    .table-container { background: white; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 1rem; text-align: left; border-bottom: 1px solid #f1f5f9; }
    .data-table th { background: #f8fafc; font-weight: 600; color: #475569; font-size: 0.875rem; }
    .data-table tr:hover { background: #f8fafc; }
    
    .badge { padding: 0.25rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
    .badge.subdomain { background: #f1f5f9; color: #64748b; font-family: monospace; }
    .badge.status.active { background: #dcfce7; color: #16a34a; }
    .badge.status.available { background: #dbeafe; color: #1e40af; }
    .badge.status.reserved { background: #fee2e2; color: #dc2626; }
    
    .empty-state { text-align: center; padding: 3rem; color: #94a3b8; }
    .error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; border-radius: 0.5rem; padding: 0.75rem 1rem; margin-bottom: 1rem; }
  `]
})
export class SubdomainManagerComponent implements OnInit {
  private platformService = inject(PlatformAdminService);
  subdomains: SubdomainInfo[] = [];
  errorMessage = '';
  loading = true;
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.platformService.getSubdomains().subscribe({
      next: data => {
        this.subdomains = data && data.length > 0 ? data : this.getMockSubdomains();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: ApiError) => {
        this.subdomains = this.getMockSubdomains();
        console.error('API Failed, using mock subdomains:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private getMockSubdomains(): SubdomainInfo[] {
    return [
      { subdomain: 'lodha', type: 'SOCIETY', linkedEntityName: 'Lodha Splendora', status: 'ACTIVE', createdAt: new Date().toISOString() },
      { subdomain: 'lodha-crown', type: 'FEDERATION', linkedEntityName: 'Lodha Crown', status: 'ACTIVE', createdAt: new Date().toISOString() }
    ];
  }
}
