import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Allow access to redevelopment documents for testing
    if (state.url.includes('/redevelopment/documents')) {
        return true;
    }

    if (authService.isAuthenticated()) {
        return true;
    }

    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
