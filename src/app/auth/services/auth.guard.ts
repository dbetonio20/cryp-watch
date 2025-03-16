/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
    private authService = inject(AuthService);
    private router = inject(Router);

    canActivate: CanActivateFn = (
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) => {
        if (this.authService.isLoggedIn()) {
            return true; // Allow access
        }

        // Redirect to login if not authenticated
        this.router.navigate(['/login']);
        return false;
    };
}
