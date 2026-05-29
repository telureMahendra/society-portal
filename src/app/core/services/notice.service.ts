import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Notice, Page, StandardResponse, NoticeListRequest, NoticeRequest, NoticeUpdateRequest } from '../models/notice.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NoticeService {
    private adminUrl = `${environment.apiBaseUrl}/admin/notices`;
    private userUrl = `${environment.apiBaseUrl}/user/notices`;

    constructor(private http: HttpClient) {}

    getNotices(request: NoticeListRequest): Observable<Page<Notice> | null> {
        return this.http.post<Page<Notice>>(`${this.adminUrl}/list`, request).pipe(
            catchError(err => {
                console.error('Error fetching notices', err);
                return of(null);
            })
        );
    }

    getNoticeDetails(id: number): Observable<Notice | undefined> {
        return this.http.post<Notice>(`${this.adminUrl}/details`, { noticeId: id }).pipe(
            catchError(() => of(undefined))
        );
    }

    createNotice(notice: NoticeRequest): Observable<Notice> {
        return this.http.post<Notice>(`${this.adminUrl}/create`, notice);
    }

    updateNotice(notice: NoticeUpdateRequest): Observable<Notice> {
        return this.http.post<Notice>(`${this.adminUrl}/update`, notice);
    }

    deleteNotice(id: number): Observable<boolean> {
        return this.http.post<void>(`${this.adminUrl}/delete`, { noticeId: id }).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    publishNotice(id: number): Observable<boolean> {
        return this.http.post<void>(`${this.adminUrl}/publish`, { noticeId: id }).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    unpublishNotice(id: number): Observable<boolean> {
        return this.http.post<void>(`${this.adminUrl}/unpublish`, { noticeId: id }).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    uploadAttachment(file: File): Observable<{ attachmentUrl: string; attachmentName: string; attachmentType: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ success: boolean; data: any }>(`${this.adminUrl}/upload`, formData).pipe(
            map(res => res.data)
        );
    }
}

