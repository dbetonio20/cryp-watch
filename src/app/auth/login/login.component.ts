/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    AbstractControl,
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ModalService } from '../../core/modal/modal.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
    authService = inject(AuthService);
    router = inject(Router);
    modalService = inject(ModalService);

    fb = inject(FormBuilder);

    form = this.fb.nonNullable.group({
        email: ['', [Validators.required, this.customEmailValidator]],
        password: ['', Validators.required],
    });

    submitted = false;
    showPassword = false;

    get passwordStrength() : { score: number; label: string; color: string } {
        const value = this.form.controls.password.value || '';
        let score = 0;
        if (value.length >= 6) score++;
        if (/[A-Z]/.test(value)) score++;
        if (/[a-z]/.test(value)) score++;
        if (/\d/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;

        const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
        const colors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#16a34a'];
        const idx = Math.min(Math.max(score - 1, 0), 4);
        return { score, label: labels[idx], color: colors[idx] };
    }

    constructor() {}

    ngOnInit() {}

    onLogin() {
        this.submitted = true;
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const rawForm = this.form.getRawValue();
        if (rawForm.email === 'dom') {
            rawForm.email = 'dom@ereflect.com';
        }
        this.authService.login(rawForm.email, rawForm.password).subscribe({
            next: () => this.router.navigate(['/cryp-watch']),
            error: (error) => {
                this.modalService.openError('Login Failed', 'Invalid email or password. Please try again.');
            }
        });
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    onLogout() {
        this.authService.logout();
    }


    //cheat
    customEmailValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email format
    
        if (value === 'dom' || emailRegex.test(value)) {
          return null; // Valid if it's 'dom' or a valid email
        }
    
        return { invalidEmail: true }; // Invalid otherwise
    }
}
