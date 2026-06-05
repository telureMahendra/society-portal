import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import {
  Complaint,
  ComplaintCategory,
  ComplaintDetails,
  ComplaintDashboard
} from '../models/complaint.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private userApiUrl = `${environment.apiBaseUrl}/user/complaints`;
  private adminApiUrl = `${environment.apiBaseUrl}/admin/complaints`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private get societyId(): number {
    return this.authService.currentUserValue?.societyId || 7; // Fallback to 7 for development if not found
  }

  // User Endpoints
  getUserCategories(): Observable<ApiResponse<ComplaintCategory[]>> {
    return this.http.post<ApiResponse<ComplaintCategory[]>>(`${this.userApiUrl}/categories`, { societyId: this.societyId });
  }

  addComplaint(data: any): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.userApiUrl}/add`, { ...data, societyId: this.societyId });
  }

  getUserComplaints(request: any): Observable<ApiResponse<PageResponse<Complaint>>> {
    return this.http.post<ApiResponse<PageResponse<Complaint>>>(`${this.userApiUrl}/list`, { ...request, societyId: this.societyId });
  }

  getUserComplaintDetails(complaintId: number): Observable<ApiResponse<ComplaintDetails>> {
    return this.http.post<ApiResponse<ComplaintDetails>>(`${this.userApiUrl}/details`, { complaintId, societyId: this.societyId });
  }

  editComplaint(data: any): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.userApiUrl}/edit`, { ...data, societyId: this.societyId });
  }

  withdrawComplaint(complaintId: number, remark: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.userApiUrl}/withdraw`, { complaintId, remark, societyId: this.societyId });
  }

  uploadUserDocument(file: File): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('societyId', this.societyId.toString());
    formData.append('file', file);
    return this.http.post<ApiResponse<any>>(`${this.userApiUrl}/upload`, formData);
  }

  // Admin Endpoints
  getDashboard(): Observable<ApiResponse<ComplaintDashboard>> {
    return this.http.post<ApiResponse<ComplaintDashboard>>(`${this.adminApiUrl}/dashboard`, { societyId: this.societyId });
  }

  getAdminComplaints(request: any): Observable<ApiResponse<PageResponse<Complaint>>> {
    return this.http.post<ApiResponse<PageResponse<Complaint>>>(`${this.adminApiUrl}/list`, { ...request, societyId: this.societyId });
  }

  getAdminComplaintDetails(complaintId: number): Observable<ApiResponse<ComplaintDetails>> {
    return this.http.post<ApiResponse<ComplaintDetails>>(`${this.adminApiUrl}/details`, { complaintId, societyId: this.societyId });
  }

  acceptComplaint(complaintId: number, remark?: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.adminApiUrl}/accept`, { complaintId, remark, societyId: this.societyId });
  }

  markUnderReview(complaintId: number, remark?: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.adminApiUrl}/under-review`, { complaintId, remark, societyId: this.societyId });
  }

  markInProgress(complaintId: number, remark?: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.adminApiUrl}/in-progress`, { complaintId, remark, societyId: this.societyId });
  }

  rejectComplaint(complaintId: number, remark: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.adminApiUrl}/reject`, { complaintId, remark, societyId: this.societyId });
  }

  markInvalid(complaintId: number, remark: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.adminApiUrl}/invalid`, { complaintId, remark, societyId: this.societyId });
  }

  reopenComplaint(complaintId: number, remark: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.adminApiUrl}/reopen`, { complaintId, remark, societyId: this.societyId });
  }

  resolveComplaint(complaintId: number, resolutionNote: string, remark?: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.adminApiUrl}/resolve`, { complaintId, resolutionNote, remark, societyId: this.societyId });
  }

  addInternalNote(complaintId: number, note: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.adminApiUrl}/add-note`, { complaintId, note, societyId: this.societyId });
  }

  uploadAdminDocument(complaintId: number, file: File): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('complaintId', complaintId.toString());
    formData.append('societyId', this.societyId.toString());
    formData.append('document', file);
    return this.http.post<ApiResponse<any>>(`${this.adminApiUrl}/upload-document`, formData);
  }
}
