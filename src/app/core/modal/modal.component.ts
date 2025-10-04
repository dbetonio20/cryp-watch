import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { ModalData, ModalResult } from './modal.interface';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})
export class ModalComponent {
    constructor(
        public dialogRef: MatDialogRef<ModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ModalData
    ) {}

    onConfirm(): void {
        this.dialogRef.close({ confirmed: true } as ModalResult);
    }

    onCancel(): void {
        this.dialogRef.close({ confirmed: false } as ModalResult);
    }
}