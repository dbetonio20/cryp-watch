import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingPageComponent {
    private readonly router = inject(Router);
    readonly currentYear = new Date().getFullYear();

    gotoLogin(): void {
        this.router.navigate(['/login']);
    }

    gotoRegister(): void {
        this.router.navigate(['/register']);
    }
}
