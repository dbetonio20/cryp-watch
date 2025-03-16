/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [FormsModule, ReactiveFormsModule],
    standalone: true,
})
export class LoginComponent implements OnInit {
    authService = inject(AuthService);

    fb = inject(FormBuilder);

    form = this.fb.nonNullable.group({
        email: ['', Validators.email],
        password: ['', Validators.required],
    });

    constructor() {}

    ngOnInit() {}

    onLogin() {
        const rawForm = this.form.getRawValue();
        console.log(rawForm);
        this.authService
            .login(rawForm.email, rawForm.password)
            .subscribe(data => {
                console.log(data);
            });
    }

    onLogout() {
        this.authService.logout();
    }
}
