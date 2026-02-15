import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SubdomainService } from '../subdomain/subdomain.service';

export const subdomainInterceptor: HttpInterceptorFn = (req, next) => {
    const subdomainService = inject(SubdomainService);
    const subdomain = subdomainService.getSubdomain();

    if (subdomain) {
        const clonedReq = req.clone({
            setHeaders: {
                'X-Subdomain': subdomain
            }
        });
        return next(clonedReq);
    }

    return next(req);
};
