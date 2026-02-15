import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SubdomainService {
    private currentSubdomainSubject = new BehaviorSubject<string | null>(null);
    public currentSubdomain$: Observable<string | null> = this.currentSubdomainSubject.asObservable();

    constructor(@Inject(DOCUMENT) private document: Document) {
        this.resolveSubdomain();
    }

    private resolveSubdomain(): void {
        const hostname = this.document.location.hostname;
        console.log('SubdomainService: Resolving subdomain for hostname:', hostname);
        const subdomain = this.extractSubdomain(hostname);
        console.log('SubdomainService: Resolved subdomain:', subdomain);
        this.currentSubdomainSubject.next(subdomain);
    }

    private extractSubdomain(hostname: string): string | null {
        // Fallback for localhost without subdomain
        if (hostname === 'localhost') {
            return null;
        }

        const parts = hostname.split('.');

        // case: platform.localhost -> parts=['platform', 'localhost']
        if (parts.length > 1 && parts[parts.length - 1] === 'localhost') {
            if (parts[0] !== 'www') {
                return parts[0];
            }
            return null;
        }

        // Handle production domains (e.g. abc.myapp.com)
        // Simple check: if more than 2 parts, first one is subdomain
        // unless it's www
        if (parts.length > 2) {
            if (parts[0] !== 'www') {
                return parts[0];
            }
        }

        // Fallback for development if configured
        return environment.defaultSubdomain || null;
    }

    public getSubdomain(): string | null {
        return this.currentSubdomainSubject.value;
    }
}
