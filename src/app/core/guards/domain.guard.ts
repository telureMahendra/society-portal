import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SubdomainService } from '../subdomain/subdomain.service';
import { AuthService } from '../auth/auth.service';

export const domainGuard: CanActivateFn = (route, state) => {
    const subdomainService = inject(SubdomainService);
    const router = inject(Router);
    const subdomain = subdomainService.getSubdomain();

    // If accessed via platform subdomain, prevent access to society pages
    if (subdomain === 'platform' || subdomain === 'admin') {
        console.log('DomainGuard: Redirecting from society page to platform dashboard due to subdomain:', subdomain);
        return router.createUrlTree(['/platform']);
    } else {
        console.log('DomainGuard: Allowing access to society page. Subdomain:', subdomain);
    }

    // Also prevent PLATFORM_ADMIN from accessing society pages even on other domains (if they somehow logged in)
    const authService = inject(AuthService);
    const user = authService.currentUserValue;
    if (user && (user.roles.includes('PLATFORM_ADMIN') || user.globalRole === 'PLATFORM_ADMIN')) {
        console.log('DomainGuard: Blocking PLATFORM_ADMIN from society page');
        return router.createUrlTree(['/platform/dashboard']);
    }

    return true;
};
