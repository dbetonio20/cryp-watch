import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./features/home/home.component').then(m => m.HomeComponent),
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./auth/login/login.component').then(m => m.LoginComponent),
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./auth/register/register.component').then(
                m => m.RegisterComponent
            ),
    },
    { path: '**', redirectTo: '' }, // Redirect unknown routes
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
