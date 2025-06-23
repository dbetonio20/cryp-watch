import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, filter } from 'rxjs';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.user$.pipe(
        filter(user => user !== undefined), // Wait until user is determined
        map(user => {
            if (user) {
                return true;
            } else {
                router.navigate(['/landing-page']);
                return false;
            }
        })
    );
};
