import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService, User } from '../auth/auth.service';
import { map, take } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['role'];

  return authService.currentUser$.pipe(
    take(1),
    map((user: User | null) => {
      console.log('RoleGuard: Checking role for user:', user?.username, 'Expected:', expectedRole);
      if (!user) {
        console.log('RoleGuard: No user logged in, redirecting to login');
        return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
      }

      const roles = Array.isArray(user.roles) ? user.roles.filter(r => !!r) : [];
      const hasRole = roles.includes(expectedRole);
      console.log('RoleGuard: User roles:', user.roles, 'Has expected role:', hasRole);

      if (!hasRole) {
        console.warn(`User ${user.username} lacks role ${expectedRole}`);
        return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
      }

      return true;
    })
  );
};
