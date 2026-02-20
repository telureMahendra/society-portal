import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SubdomainService } from '../subdomain/subdomain.service';

export const landingGuard: CanActivateFn = (route, state) => {
    const subdomainService = inject(SubdomainService);
    const router = inject(Router);
    const subdomain = subdomainService.getSubdomain();

    // If no subdomain is present (base domain access), redirect to landing
    if (!subdomain) {
        // If we are already on landing path, allow
        if (state.url === '/landing') {
            return true;
        }
        return router.createUrlTree(['/landing']);
    }

    // If subdomain is 'platform' or 'admin', it's already handled by domainGuard usually,
    // but here we allow it to pass through to its own routes.
    if (subdomain === 'platform' || subdomain === 'admin') {
        return true;
    }

    // If any other subdomain exists, we allow normal routing (society portal)
    return true;
};
