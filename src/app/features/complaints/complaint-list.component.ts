import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ComplaintService } from '../../core/services/complaint.service';
import { AuthService } from '../../core/auth/auth.service';
import { Complaint, ComplaintDashboard, ComplaintStatus, ComplaintPriority } from '../../core/models/complaint.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-complaint-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './complaint-list.component.html',
  styleUrls: ['./complaint-list.component.scss']
})
export class ComplaintListComponent implements OnInit {
  isAdmin = false;
  dashboard: ComplaintDashboard | null = null;
  complaints: Complaint[] = [];
  
  isLoading = true;
  searchTerm = '';
  currentStatus = '';
  currentPriority = '';

  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;

  statuses = Object.values(ComplaintStatus);
  priorities = Object.values(ComplaintPriority);

  private searchSubject = new Subject<string>();

  constructor(
    private complaintService: ComplaintService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    const roles = this.authService.currentUserValue?.roles || [];
    this.isAdmin = roles.includes('SOCIETY_ADMIN') || roles.includes('PLATFORM_ADMIN');
  }

  ngOnInit() {
    if (this.isAdmin) {
      this.loadDashboard();
    }
    
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.currentPage = 0;
      this.loadComplaints();
    });

    this.loadComplaints();
  }

  loadDashboard() {
    this.complaintService.getDashboard().pipe(
      catchError(err => {
        console.error('Error loading dashboard:', err);
        return of(null);
      })
    ).subscribe({
      next: (res) => {
        if (res && res.status === '00' && res.data) {
          this.dashboard = res.data;
          this.cdr.detectChanges();
        }
      }
    });
  }

  loadComplaints() {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    const req: any = {
      page: this.currentPage,
      size: this.pageSize
    };

    if (this.searchTerm) req.search = this.searchTerm;
    if (this.currentStatus) req.status = this.currentStatus;
    if (this.currentPriority) req.priority = this.currentPriority;

    const request$ = this.isAdmin 
      ? this.complaintService.getAdminComplaints(req)
      : this.complaintService.getUserComplaints(req);

    request$.pipe(
      finalize(() => {
        // Ensure isLoading is ALWAYS set to false, triggering change detection properly
        this.isLoading = false;
        this.cdr.detectChanges(); // Force Angular to update the UI immediately
      }),
      catchError(err => {
        console.error('Error loading complaints stream:', err);
        return of(null); // Return a safe null response so the stream completes
      })
    ).subscribe({
      next: (res: any) => {
        try {
          if (res && res.status === '00' && res.data) {
            // Handle both Page object (res.data.content) and raw List (res.data) just in case
            this.complaints = res.data.content || (Array.isArray(res.data) ? res.data : []);
            this.totalPages = res.data.totalPages || 0;
            this.totalElements = res.data.totalElements || this.complaints.length;
          } else {
            this.complaints = [];
            this.totalPages = 0;
            this.totalElements = 0;
          }
        } catch (e) {
          console.error('Error parsing complaints response:', e);
          this.complaints = [];
          this.totalPages = 0;
          this.totalElements = 0;
        }
        
        this.cdr.detectChanges();
      }
    });
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  setStatusFilter(status: string) {
    this.currentStatus = status;
    this.currentPage = 0;
    this.loadComplaints();
  }
  
  setPriorityFilter(priority: string) {
    this.currentPriority = priority;
    this.currentPage = 0;
    this.loadComplaints();
  }

  resetFilters() {
    this.searchTerm = '';
    this.currentStatus = '';
    this.currentPriority = '';
    this.currentPage = 0;
    this.loadComplaints();
  }

  changePage(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.currentPage = newPage;
      this.loadComplaints();
    }
  }
}
