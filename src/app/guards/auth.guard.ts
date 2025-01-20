import { inject } from '@angular/core';
import {  CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user-service/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const isAuthenticated = inject(UserService).isLoggedIn();
  const router = inject(Router);

  return isAuthenticated ? true : router.parseUrl('/login');
};
  
