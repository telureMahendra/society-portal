import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlatformAdminLayout } from './layout/platform-admin-layout/platform-admin-layout';
import { PlatformDashboard } from './pages/dashboard/platform-dashboard/platform-dashboard';
import { FederationList } from './pages/federations/federation-list/federation-list';
import { SocietyList } from './pages/societies/society-list/society-list';
import { SubdomainList } from './pages/subdomains/subdomain-list/subdomain-list';
import { PlatformMonitoring } from './pages/monitoring/platform-monitoring/platform-monitoring';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role-guard';

const routes: Routes = [
  {
    path: '',
    component: PlatformAdminLayout,
    canActivate: [authGuard, roleGuard],
    data: { role: 'PLATFORM_ADMIN' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: PlatformDashboard },
      { path: 'federations', component: FederationList },
      { path: 'societies', component: SocietyList },
      { path: 'subdomains', component: SubdomainList },
      { path: 'monitoring', component: PlatformMonitoring }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatformAdminRoutingModule { }
