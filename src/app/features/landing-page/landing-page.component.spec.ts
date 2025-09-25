import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { LandingPageComponent } from './landing-page.component';

describe('LandingPageComponent', () => {
    let fixture: ComponentFixture<LandingPageComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LandingPageComponent, RouterTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(LandingPageComponent);
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    it('should create the landing page component', () => {
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('should navigate to the login page from header CTA', async () => {
        const navigateSpy = spyOn(router, 'navigate').and.returnValue(
            Promise.resolve(true)
        );

        const loginButton = fixture.debugElement.query(
            By.css('[data-testid="header-login"]')
        ).nativeElement as HTMLButtonElement;

        loginButton.click();

        await fixture.whenStable();
        expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    });

    it('should navigate to the registration page from header CTA', async () => {
        const navigateSpy = spyOn(router, 'navigate').and.returnValue(
            Promise.resolve(true)
        );

        const registerButton = fixture.debugElement.query(
            By.css('[data-testid="header-register"]')
        ).nativeElement as HTMLButtonElement;

        registerButton.click();

        await fixture.whenStable();
        expect(navigateSpy).toHaveBeenCalledWith(['/register']);
    });

    it('should render the current year in the footer copy', () => {
        const footerCopy = fixture.debugElement.query(
            By.css('[data-testid="footer-copy"]')
        ).nativeElement as HTMLElement;

        expect(footerCopy.textContent).toContain(
            new Date().getFullYear().toString()
        );
    });
});
