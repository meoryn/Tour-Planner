import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStateService } from './user-state-service';

export const authGuard: CanActivateFn = () => {
  const userState = inject(UserStateService);
  const router = inject(Router);

  if (userState.isAuthenticated()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
