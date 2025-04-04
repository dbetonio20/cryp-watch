/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, inject, OnInit } from '@angular/core';
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

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [FormsModule, ReactiveFormsModule],
    standalone: true,
})
export class LoginComponent implements OnInit {
    authService = inject(AuthService);
    router = inject(Router);

    fb = inject(FormBuilder);

    form = this.fb.nonNullable.group({
        email: ['', this.customEmailValidator],
        password: ['', Validators.required],
    });

    constructor() {}

    ngOnInit() {}

    onLogin() {
        
        const rawForm = this.form.getRawValue();
        if(rawForm.email === 'dom'){
            rawForm.email = 'dom@ereflect.com';
        }
        console.log(rawForm);
        this.authService
            .login(rawForm.email, rawForm.password)
            .subscribe(data => {
                this.router.navigate(['/cryp-watch']);
        });
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
