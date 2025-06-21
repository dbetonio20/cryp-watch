import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent { 
  authService = inject(AuthService);
  router = inject(Router);
  constructor() {}


  onLogout() {
    this.authService.logout();
  }

  gotoLogin() {
    this.router.navigate(['/login']);
  }
}
