import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

export interface ApiError {
    status: number;
    message: string;
    url?: string | null;
    details?: unknown;
}

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const notificationService = inject(NotificationService);

    // Add a default timeout of 30 seconds for all requests
    return next(req).pipe(
        timeout(30000),
        catchError((error: unknown) => {
            let status = 0;
            let message = 'An unexpected error occurred';
            let details = null;
            let url = req.url;

            if (error instanceof HttpErrorResponse) {
                status = error.status;
                url = error.url || req.url;
                details = error.error;

                // Extract message from backend error response
                message =
                    error.error?.message ||
                    error.error?.error ||
                    (typeof error.error === 'string' ? error.error : null) ||
                    error.message ||
                    'Unexpected API error';

                // Handle specific status codes
                if (status === 0) {
                    message = 'Network error. Please check your connection.';
                } else if (status === 401) {
                    // Let auth interceptor handle redirect, but maybe show info
                    // message = 'Session expired. Please login again.';
                } else if (status === 403) {
                    message = 'Access denied. You do not have permission to perform this action.';
                } else if (status >= 500) {
                    message = 'Server error. Please try again later.';
                }
            } else if (error instanceof TimeoutError) {
                status = 408;
                message = 'Request timed out. Server is taking too long to respond.';
            }

            // Display the notification
            if (status !== 401) { // Skip toast for 401 if we want to avoid spamming on session expiry
                notificationService.error(message);
            }

            const apiError: ApiError = {
                status,
                message,
                url,
                details
            };

            return throwError(() => apiError);
        })
    );
};
