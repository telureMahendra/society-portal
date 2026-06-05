import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ComplaintService } from '../../core/services/complaint.service';
import { AuthService } from '../../core/auth/auth.service';
import { ComplaintDetails, ComplaintStatus, ComplaintHistory, ComplaintDocument, ComplaintInternalNote } from '../../core/models/complaint.model';
import { NotificationService } from '../../core/services/notification.service';
import { HttpClient } from '@angular/common/http';
import { finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-complaint-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './complaint-view.component.html',
  styleUrls: ['./complaint-view.component.scss']
})
export class ComplaintViewComponent implements OnInit {
  complaintId!: number;
  details: ComplaintDetails | null = null;
  complaint: any | null = null;
  isAdmin = false;
  isLoading = true;

  // Modals / Actions state
  actionModalVisible = false;
  actionType: 'accept' | 'reject' | 'invalid' | 'reopen' | 'withdraw' | 'resolve' | 'under-review' | 'in-progress' | '' = '';
  actionRemark = '';
  actionResolutionNote = '';

  newNote = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private complaintService: ComplaintService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    const roles = this.authService.currentUserValue?.roles || [];
    this.isAdmin = roles.includes('SOCIETY_ADMIN') || roles.includes('PLATFORM_ADMIN');
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.complaintId = +params['id'];
      this.loadDetails();
    });
  }

  loadDetails() {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    const request$ = this.isAdmin
      ? this.complaintService.getAdminComplaintDetails(this.complaintId)
      : this.complaintService.getUserComplaintDetails(this.complaintId);

    request$.pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }),
      catchError(err => {
        this.notificationService.error('An error occurred');
        this.router.navigate(['/complaints']);
        return of(null);
      })
    ).subscribe({
      next: (res: any) => {
        try {
          if (res && res.status === '00' && res.data) {
            this.details = res.data;
            this.complaint = res.data.complaint;
            
            // To make template easy, attach history, notes, documents to this.complaint
            if (this.complaint) {
              this.complaint.history = res.data.history || [];
              this.complaint.documents = res.data.documents || [];
              this.complaint.internalNotes = res.data.internalNotes || [];
            }
          } else if (res) {
            this.notificationService.error(res.message || 'Failed to load details');
            this.router.navigate(['/complaints']);
          }
        } catch (e) {
          console.error("Error parsing complaint details", e);
          this.notificationService.error('Failed to parse details');
          this.router.navigate(['/complaints']);
        }
        
        this.cdr.detectChanges();
      }
    });
  }

  openActionModal(type: any) {
    this.actionType = type;
    this.actionRemark = '';
    this.actionResolutionNote = '';
    this.actionModalVisible = true;
    this.cdr.detectChanges();
  }

  closeActionModal() {
    this.actionModalVisible = false;
    this.actionType = '';
    this.cdr.detectChanges();
  }

  performAction() {
    if (!this.actionType) return;
    
    // Resolve requires resolution note
    if (this.actionType === 'resolve' && !this.actionResolutionNote.trim()) {
        this.notificationService.error('Resolution note is required');
        return;
    }

    let request$;
    if (!this.isAdmin && this.actionType === 'withdraw') {
        request$ = this.complaintService.withdrawComplaint(this.complaintId, this.actionRemark);
    } else if (this.isAdmin) {
        switch(this.actionType) {
            case 'accept': request$ = this.complaintService.acceptComplaint(this.complaintId, this.actionRemark); break;
            case 'reject': request$ = this.complaintService.rejectComplaint(this.complaintId, this.actionRemark); break;
            case 'invalid': request$ = this.complaintService.markInvalid(this.complaintId, this.actionRemark); break;
            case 'reopen': request$ = this.complaintService.reopenComplaint(this.complaintId, this.actionRemark); break;
            case 'under-review': request$ = this.complaintService.markUnderReview(this.complaintId, this.actionRemark); break;
            case 'in-progress': request$ = this.complaintService.markInProgress(this.complaintId, this.actionRemark); break;
            case 'resolve': request$ = this.complaintService.resolveComplaint(this.complaintId, this.actionResolutionNote, this.actionRemark); break;
        }
    }

    if (request$) {
        request$.subscribe({
            next: (res: any) => {
                if(res.status === '00') {
                    this.notificationService.success(`Complaint marked as ${this.actionType} successfully`);
                    this.closeActionModal();
                    this.loadDetails();
                } else {
                    this.notificationService.error(res.message);
                }
            },
            error: () => this.notificationService.error('Action failed')
        });
    }
  }

  addNote() {
      if(!this.newNote.trim()) return;
      this.complaintService.addInternalNote(this.complaintId, this.newNote).subscribe({
          next: (res: any) => {
              if(res.status === '00') {
                  this.notificationService.success('Note added');
                  this.newNote = '';
                  this.loadDetails();
              }
          }
      });
  }

  onDocumentUpload(event: any) {
      const file = event.target.files[0];
      if (file) {
          if (file.size > 5 * 1024 * 1024) {
              this.notificationService.error('File size should not exceed 5MB');
              return;
          }
          this.complaintService.uploadAdminDocument(this.complaintId, file).subscribe({
              next: (res: any) => {
                  if (res.status === '00') {
                      this.notificationService.success('Document uploaded');
                      this.loadDetails();
                  } else {
                      this.notificationService.error(res.message);
                  }
              }
          });
      }
  }
}
