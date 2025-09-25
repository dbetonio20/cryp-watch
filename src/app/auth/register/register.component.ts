/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegisterComponent implements OnInit {
    authService = inject(AuthService);

    fb = inject(FormBuilder);

    form = this.fb.nonNullable.group({
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordsMatch });
    submitted = false;
    showPassword = false;
    showConfirmPassword = false;

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

    onRegister(): void {
        this.submitted = true;
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const rawForm = this.form.getRawValue();
        this.authService.register(
            rawForm.email,
            rawForm.username,
            rawForm.password
        );
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    toggleConfirmPasswordVisibility() {
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    private passwordsMatch(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;
        if (!password || !confirmPassword) return null;
        return password === confirmPassword ? null : { passwordsMismatch: true };
    }
}
