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

    private isIPAddress(hostname: string): boolean {
        // Detect pure IP addresses (IPv4)
        const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
        return ipPattern.test(hostname) || hostname === 'localhost';
    }

    private extractSubdomain(hostname: string): string | null {
        // Fallback for localhost or IP without subdomain
        if (this.isIPAddress(hostname)) {
            return null;
        }

        const parts = hostname.split('.');

        // Handle IP-based hostnames like "lodha.194.164.149.201"
        const isIpHostname = parts.length >= 5 && parts.slice(-4).every(p => /^\d{1,3}$/.test(p));
        if (isIpHostname) {
            return parts.slice(0, parts.length - 4).join('.');
        }

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

    public getBaseDomain(): string {
        const hostname = this.document.location.hostname;

        if (this.isIPAddress(hostname)) {
            return hostname;
        }

        const parts = hostname.split('.');

        // Handle IP-based hostnames
        const isIpHostname = parts.length >= 4 && parts.slice(-4).every(p => /^\d{1,3}$/.test(p));
        if (isIpHostname) {
            return parts.slice(-4).join('.');
        }

        // Handle localhost
        if (hostname === 'localhost' || parts[parts.length - 1] === 'localhost') {
            return 'localhost';
        }

        // Handle production domains (e.g., app.estatepilot.com -> estatepilot.com)
        if (parts.length > 2) {
            return parts.slice(-2).join('.');
        }

        return hostname;
    }

    public constructUrl(subdomain: string, path: string): string {
        const hostname = this.document.location.hostname;
        const baseDomain = this.getBaseDomain();
        const port = this.document.location.port;
        const protocol = this.document.location.protocol;

        let url = '';
        if (this.isIPAddress(hostname)) {
            // Cannot use subdomains with IP addresses
            url = `${protocol}//${hostname}`;
        } else {
            url = `${protocol}//${subdomain}.${baseDomain}`;
        }

        if (port) {
            url += `:${port}`;
        }
        url += path.startsWith('/') ? path : `/${path}`;

        return url;
    }
}
