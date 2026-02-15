import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ApiError {
    status: number;
    message: string;
    url?: string | null;
    details?: unknown;
}

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) =>
    next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            const message =
                error.error?.message ||
                error.error?.error ||
                (typeof error.error === 'string' ? error.error : null) ||
                error.message ||
                'Unexpected API error';

            const apiError: ApiError = {
                status: error.status,
                message,
                url: error.url,
                details: error.error
            };

            return throwError(() => apiError);
        })
    );
