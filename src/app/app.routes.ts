import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

import { PaymentListComponent } from './features/payments/payment-list.component';
import { NoticeListComponent } from './features/notices/notice-list.component';
import { EventListComponent } from './features/events/event-list.component';
import { EventCreateComponent } from './features/events/event-create.component';
import { EventEditComponent } from './features/events/event-edit.component';
import { EventViewComponent } from './features/events/event-view.component';
import { authGuard } from './core/guards/auth.guard';
import { domainGuard } from './core/guards/domain.guard';

import { landingGuard } from './core/guards/landing.guard';
import { EstatePilotLandingComponent } from './features/landing/estate-pilot-landing.component';
import { SocietyUnitsComponent } from './features/units/society-units.component';
import { MemberListComponent } from './features/members/member-list.component';
import { VisitorListComponent } from './features/visitors/visitor-list.component';

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
            { path: '', redirectTo: '/landing', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            {
            path: 'billing',
            children: [
                { path: '', loadComponent: () => import('./features/billing/components/billing-dashboard.component').then(m => m.BillingDashboardComponent) },
                { path: 'configuration', loadComponent: () => import('./features/billing/components/billing-config.component').then(m => m.BillingConfigComponent) },
                { path: 'history', loadComponent: () => import('./features/billing/components/billing-history.component').then(m => m.BillingHistoryComponent) },
                { path: 'details/:id', loadComponent: () => import('./features/billing/components/billing-details.component').then(m => m.BillingDetailsComponent) },
                { path: 'addon', loadComponent: () => import('./features/billing/components/addon-bill.component').then(m => m.AddonBillComponent) }
            ]
        },
            { path: 'payments', component: PaymentListComponent },
            { 
                path: 'notices', 
                children: [
                    { path: '', component: NoticeListComponent },
                    { path: 'create', loadComponent: () => import('./features/notices/notice-create.component').then(m => m.NoticeCreateComponent) },
                    { path: 'edit/:id', loadComponent: () => import('./features/notices/notice-edit.component').then(m => m.NoticeEditComponent) },
                    { path: 'view/:id', loadComponent: () => import('./features/notices/notice-view.component').then(m => m.NoticeViewComponent) }
                ]
            },
            { 
                path: 'events', 
                children: [
                    { path: '', component: EventListComponent },
                    { path: 'create', component: EventCreateComponent },
                    { path: 'edit/:id', component: EventEditComponent },
                    { path: 'view/:id', component: EventViewComponent }
                ]
            },
            {
                path: 'configuration',
                children: [
                    { path: 'payment', loadComponent: () => import('./features/configuration/payment-configuration/payment-configuration.component').then(m => m.PaymentConfigurationComponent) }
                ]
            },
            {
                path: 'complaint-categories',
                loadComponent: () => import('./features/complaints/categories/category-config.component').then(m => m.CategoryConfigComponent)
            },
            { 
                path: 'complaints', 
                children: [
                    { path: '', loadComponent: () => import('./features/complaints/complaint-list.component').then(m => m.ComplaintListComponent) },
                    { path: 'create', loadComponent: () => import('./features/complaints/complaint-create.component').then(m => m.ComplaintCreateComponent) },
                    { path: 'view/:id', loadComponent: () => import('./features/complaints/complaint-view.component').then(m => m.ComplaintViewComponent) }
                ]
            },
            { path: 'units', component: SocietyUnitsComponent },
            { path: 'members', component: MemberListComponent },
            { path: 'visitors', component: VisitorListComponent }
        ]
    },
    { path: '**', redirectTo: 'landing' }
];
