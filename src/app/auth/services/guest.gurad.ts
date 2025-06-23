import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { filter, map } from 'rxjs';

export const guestGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.user$.pipe(
        filter(user => user !== undefined), // Ensure the auth state is loaded
        map(user => {
            if (!user) {
                return true;
            } else {
                router.navigate(['/cryp-watch']);
                return false;
            }
        })
    );
};
