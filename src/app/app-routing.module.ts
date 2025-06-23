import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/services/auth.guard';
import { guestGuard } from './auth/services/guest.gurad';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'cryp-watch',
        pathMatch: 'full',
    },
    {
        path: 'cryp-watch',
        loadComponent: () =>
            import('./features/home/home.component').then(m => m.HomeComponent),
        canActivate: [authGuard],
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./auth/login/login.component').then(m => m.LoginComponent),
        canActivate: [guestGuard],
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./auth/register/register.component').then(m => m.RegisterComponent),
        canActivate: [guestGuard],
    },
    {
        path: 'landing-page',
        loadComponent: () =>
            import('./features/landing-page/landing-page.component').then(m => m.LandingPageComponent),
        canActivate: [guestGuard],
    },
    { path: '**', redirectTo: 'cryp-watch' },
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
