import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ModalComponent } from './modal.component';
import { ModalData, ModalResult } from './modal.interface';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    constructor(private dialog: MatDialog) {}

    openAlert(title: string, message: string): Observable<ModalResult> {
        const data: ModalData = {
            title,
            message,
            type: 'alert'
        };
        return this.openModal(data);
    }

    openConfirm(title: string, message: string, confirmText?: string, cancelText?: string): Observable<ModalResult> {
        const data: ModalData = {
            title,
            message,
            type: 'confirm',
            confirmText,
            cancelText
        };
        return this.openModal(data);
    }

    openError(title: string, message: string): Observable<ModalResult> {
        const data: ModalData = {
            title,
            message,
            type: 'error'
        };
        return this.openModal(data);
    }

    private openModal(data: ModalData): Observable<ModalResult> {
        const dialogRef = this.dialog.open(ModalComponent, {
            data,
            disableClose: true,
            maxWidth: '90vw',
            width: '400px',
            panelClass: 'custom-modal-panel'
        });
        return dialogRef.afterClosed();
    }
}