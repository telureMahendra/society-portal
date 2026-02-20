import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { SocietyBranding } from '../models/branding.model';
import { SubdomainService } from '../subdomain/subdomain.service';

@Injectable({
    providedIn: 'root'
})
export class BrandingService {
    private brandingSubject = new BehaviorSubject<SocietyBranding | null>(null);
    public branding$ = this.brandingSubject.asObservable();

    private readonly defaultBranding: SocietyBranding = {
        societyId: 0,
        name: 'EstatePilot',
        subdomain: '',
        logoUrl: '/logo.jpg',
        bannerUrl: '/assets/banner.jpg',
        theme: {
            primaryColor: '#3f51b5',
            secondaryColor: '#ff4081',
            accentColor: '#00bcd4',
            textColor: '#333333',
            backgroundColor: '#ffffff'
        },
        featureFlags: {
            enableBilling: true,
            enableNotices: true,
            enableEvents: true
        }
    };

    constructor(
        private http: HttpClient,
        private subdomainService: SubdomainService,
        @Inject(DOCUMENT) private document: Document,
        private titleService: Title
    ) { }

    public loadBranding(): Observable<SocietyBranding> {
        const subdomain = this.subdomainService.getSubdomain();
        const isPlatformSubdomain = subdomain === 'platform' || subdomain === 'admin';

        if (!subdomain || isPlatformSubdomain) {
            console.log('No subdomain detected, loading default branding.');
            this.applyBranding(this.defaultBranding);
            return of(this.defaultBranding);
        }

        const apiUrl = `${environment.apiBaseUrl}/public/society`;

        return this.http.get<any>(apiUrl).pipe(
            tap(response => {
                const branding: SocietyBranding = {
                    societyId: 0,
                    name: response.name,
                    subdomain: response.subdomain,
                    logoUrl: response.logoUrl || '/logo.jpg',
                    bannerUrl: response.bannerUrl || '/assets/banner.jpg',
                    theme: this.defaultBranding.theme,
                    featureFlags: this.defaultBranding.featureFlags
                };

                console.log(`Loaded branding for ${subdomain}`, branding);
                this.applyBranding(branding);
            }),
            catchError(err => {
                console.error('Failed to load branding', err);
                this.applyBranding(this.defaultBranding);
                return of(this.defaultBranding);
            })
        );
    }

    private applyBranding(branding: SocietyBranding): void {
        this.brandingSubject.next(branding);

        const root = this.document.documentElement;
        if (branding.theme) {
            root.style.setProperty('--primary-color', branding.theme.primaryColor);
            root.style.setProperty('--secondary-color', branding.theme.secondaryColor);
            root.style.setProperty('--accent-color', branding.theme.accentColor);
            root.style.setProperty('--text-color', branding.theme.textColor || '#333');
            root.style.setProperty('--background-color', branding.theme.backgroundColor || '#fff');
        }

        this.titleService.setTitle(branding.name);
        this.updateFavicon(branding.logoUrl);
    }

    private updateFavicon(url: string) {
        let link: HTMLLinkElement | null = this.document.querySelector("link[rel*='icon']");
        if (!link) {
            link = this.document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            this.document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = url;
    }
}
