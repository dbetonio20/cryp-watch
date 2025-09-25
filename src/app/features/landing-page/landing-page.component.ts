import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { buildInfo } from 'src/environments/build-info';

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
    readonly commitHash = buildInfo.gitSha || 'unknown';
    readonly buildTimestamp =
        buildInfo.generatedAt && buildInfo.generatedAt !== 'unknown'
            ? new Date(buildInfo.generatedAt)
            : undefined;

    gotoLogin(): void {
        this.router.navigate(['/login']);
    }

    gotoRegister(): void {
        this.router.navigate(['/register']);
    }
}
