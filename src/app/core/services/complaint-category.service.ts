import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ComplaintCategory {
  id: number;
  categoryName: string;
  description?: string;
  active: boolean;
  displayOrder: number;
  createdAt?: string;
}

export interface ComplaintCategoryAddRequest {
  categoryName: string;
  description?: string;
  displayOrder: number;
}

export interface ComplaintCategoryUpdateRequest {
  categoryId: number;
  categoryName: string;
  description?: string;
  displayOrder: number;
}

@Injectable({
  providedIn: 'root'
})
export class ComplaintCategoryService {
  private adminApiUrl = `${environment.apiBaseUrl}/admin/complaint-category`;
  private userApiUrl = `${environment.apiBaseUrl}/user/complaints/categories`;

  constructor(private http: HttpClient) {}

  // Admin APIs
  listCategories(request: any): Observable<any> {
    return this.http.post(`${this.adminApiUrl}/list`, request);
  }

  addCategory(request: ComplaintCategoryAddRequest): Observable<any> {
    return this.http.post(`${this.adminApiUrl}/add`, request);
  }

  updateCategory(request: ComplaintCategoryUpdateRequest): Observable<any> {
    return this.http.put(`${this.adminApiUrl}/update`, request);
  }

  changeStatus(categoryId: number, active: boolean): Observable<any> {
    return this.http.patch(`${this.adminApiUrl}/change-status`, { categoryId, active });
  }

  deleteCategory(categoryId: number): Observable<any> {
    return this.http.patch(`${this.adminApiUrl}/delete`, { categoryId });
  }

  // User APIs
  getActiveCategories(): Observable<any> {
    return this.http.post(this.userApiUrl, {});
  }
}
