import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { BrandingService } from './core/branding/branding.service';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { subdomainInterceptor } from './core/interceptors/subdomain.interceptor';
import { apiErrorInterceptor } from './core/interceptors/api-error.interceptor';

function initializeApp(brandingService: BrandingService) {
  return () => firstValueFrom(brandingService.loadBranding());
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([subdomainInterceptor, authInterceptor, apiErrorInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [BrandingService],
      multi: true
    }
  ]
};
