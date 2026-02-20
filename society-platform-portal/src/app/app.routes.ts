import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { BillListComponent } from './features/billing/bill-list.component';
import { PaymentListComponent } from './features/payments/payment-list.component';
import { NoticeListComponent } from './features/notices/notice-list.component';
import { EventListComponent } from './features/events/event-list.component';
import { authGuard } from './core/guards/auth.guard';
import { domainGuard } from './core/guards/domain.guard';

import { landingGuard } from './core/guards/landing.guard';
import { EstatePilotLandingComponent } from './features/landing/estate-pilot-landing.component';

export const routes: Routes = [
    { path: 'landing', component: EstatePilotLandingComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'platform',
        loadChildren: () => import('./features/platform-admin/platform-admin.routes').then(m => m.PLATFORM_ADMIN_ROUTES)
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [landingGuard, authGuard, domainGuard],
        children: [
            { path: '', redirectTo: '/login', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'bills', component: BillListComponent },
            { path: 'payments', component: PaymentListComponent },
            { path: 'notices', component: NoticeListComponent },
            { path: 'events', component: EventListComponent }
        ]
    },
    { path: '**', redirectTo: 'landing' }
];
