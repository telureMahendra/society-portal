export enum ComplaintStatus {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
  INVALID = 'INVALID',
  REOPENED = 'REOPENED',
  WITHDRAWN = 'WITHDRAWN'
}

export enum ComplaintPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ComplaintDocumentType {
  COMPLAINT_ATTACHMENT = 'COMPLAINT_ATTACHMENT',
  ADMIN_ATTACHMENT = 'ADMIN_ATTACHMENT',
  SUPPORTING_DOCUMENT = 'SUPPORTING_DOCUMENT'
}

export interface ComplaintCategory {
  id: number;
  name: string;
  description: string;
}

export interface Complaint {
  id: number;
  complaintNumber: string;
  categoryId: number;
  categoryName: string;
  title: string;
  description: string;
  priority: ComplaintPriority;
  location: string;
  status: ComplaintStatus;
  adminRemark?: string;
  resolutionNote?: string;
  acceptedAt?: string;
  resolvedAt?: string;
  withdrawnAt?: string;
  createdAt: string;
  updatedAt: string;
  userId?: number;
  userName?: string;
  userFlat?: string;
}

export interface ComplaintDocument {
  id: number;
  documentType: ComplaintDocumentType;
  fileName: string;
  fileUrl: string;
  uploadedByName: string;
  uploadedAt: string;
}

export interface ComplaintHistory {
  id: number;
  actionType: string;
  oldStatus: ComplaintStatus;
  newStatus: ComplaintStatus;
  oldData?: string;
  newData?: string;
  remarks?: string;
  changedByName: string;
  changedAt: string;
}

export interface ComplaintInternalNote {
  id: number;
  note: string;
  createdByName: string;
  createdAt: string;
}

export interface ComplaintDetails {
  complaint: Complaint;
  documents: ComplaintDocument[];
  history: ComplaintHistory[];
  internalNotes?: ComplaintInternalNote[];
}

export interface ComplaintDashboard {
  total: number;
  submitted: number;
  underReview: number;
  accepted: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  invalid: number;
}
