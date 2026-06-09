import { Routes } from '@angular/router';
import { PlatformAdminLayoutComponent } from '../../layout/platform-admin-layout/platform-admin-layout.component';
import { PlatformDashboardComponent } from './pages/dashboard/platform-dashboard.component';
import { FederationManagementComponent } from './pages/federations/federation-management.component';
import { SocietyManagementComponent } from './pages/societies/society-management.component';
import { SocietyOnboardingWizard } from './pages/societies/society-onboarding-wizard/society-onboarding-wizard';
import { SocietyDetails } from './pages/societies/society-details/society-details';
import { SubdomainManagerComponent } from './pages/subdomains/subdomain-manager.component';
import { PlatformMonitoringComponent } from './pages/monitoring/platform-monitoring.component';
import { roleGuard } from '../../core/guards/role-guard';

export const PLATFORM_ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: PlatformAdminLayoutComponent,
        canActivate: [roleGuard],
        data: { role: 'PLATFORM_ADMIN' },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: PlatformDashboardComponent },
            { path: 'federations', component: FederationManagementComponent },
            { path: 'societies', component: SocietyManagementComponent },
            { path: 'societies/create', component: SocietyOnboardingWizard },
            { path: 'societies/:id', component: SocietyDetails },
            { path: 'subdomains', component: SubdomainManagerComponent },
            { path: 'monitoring', component: PlatformMonitoringComponent },
            { path: 'requests/payment-configuration', loadComponent: () => import('./requests/payment-configuration/payment-config-requests.component').then(m => m.PaymentConfigRequestsComponent) },
            { path: 'requests/payment-configuration/:id', loadComponent: () => import('./requests/payment-configuration/details/payment-config-request-details.component').then(m => m.PaymentConfigRequestDetailsComponent) }
        ]
    }
];
