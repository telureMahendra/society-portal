import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { BrandingService } from '../../core/branding/branding.service';
import { SocietyBranding } from '../../core/models/branding.model';
import { ApiError } from '../../core/interceptors/api-error.interceptor';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    error = '';
    branding: SocietyBranding | null = null;
    returnUrl = '/dashboard';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private brandingService: BrandingService
    ) {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    ngOnInit() {
        console.log('LoginComponent: Initialized');
        this.brandingService.branding$.subscribe(branding => {
            console.log('LoginComponent: Branding update', branding);
            this.branding = branding;
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

        // Redirect if already logged in
        if (this.authService.isAuthenticated()) {
            console.log('LoginComponent: Authenticated check');
            const user = this.authService.currentUserValue;
            const isPlatformHost = window.location.hostname.startsWith('platform') || window.location.hostname.startsWith('admin');

            if (user) {
                console.log('LoginComponent: User found, redirecting');
                if (isPlatformHost && user.roles.includes('PLATFORM_ADMIN')) {
                    this.router.navigate(['/platform/dashboard']);
                } else if (!isPlatformHost && !user.roles.includes('PLATFORM_ADMIN')) {
                    this.router.navigate([this.returnUrl]);
                } else {
                    this.authService.logout();
                    this.error = 'Session mismatch. Please login again.';
                }
            } else {
                console.log('LoginComponent: Token exists but no user, logging out to clear state');
                this.authService.logout();
            }
        }
    }

    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;
        this.error = '';

        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authService.login(this.loginForm.value)
            .subscribe({
                next: () => {
                    const user = this.authService.currentUserValue;
                    const isPlatformHost = window.location.hostname.startsWith('platform') || window.location.hostname.startsWith('admin');
                    if (user && isPlatformHost && user.roles.includes('PLATFORM_ADMIN')) {
                        this.router.navigate(['/platform/dashboard']);
                    } else if (user && !isPlatformHost && !user.roles.includes('PLATFORM_ADMIN')) {
                        this.router.navigate([this.returnUrl]);
                    } else {
                        this.authService.logout();
                        this.error = 'Invalid account for this portal.';
                        this.loading = false;
                    }
                },
                error: (error: ApiError) => {
                    this.error = error.message || 'Login failed';
                    this.loading = false;
                }
            });
    }
}
