import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-add-crypto',
    templateUrl: './add-crypto.component.html',
    styleUrls: ['./add-crypto.component.css'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgIf],
})
export class AddCryptoComponent {
    form: FormGroup;

    constructor(
        private dialogRef: MatDialogRef<AddCryptoComponent>,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            coinName: ['', Validators.required],
            investment: [0, [Validators.required, Validators.min(0.01)]],
            boughtPrice: [0, [Validators.required, Validators.min(0.01)]],
        });
    }

    public save() {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        } else {
            this.form.markAllAsTouched();
        }
    }
}
