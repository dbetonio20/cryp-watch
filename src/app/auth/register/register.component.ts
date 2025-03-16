/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    imports: [FormsModule, ReactiveFormsModule ],
    standalone: true,
})
export class RegisterComponent implements OnInit {
    authService = inject(AuthService);

    fb = inject(FormBuilder);

    form = this.fb.nonNullable.group({
        username: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required],
    });
    constructor() {}

    ngOnInit() {}

    onRegister(): void {
        const rawForm = this.form.getRawValue();
        console.log(rawForm)
        this.authService.register(
            rawForm.email,
            rawForm.username,
            rawForm.password
        );
    }
}
