export interface ModalData {
    title: string;
    message: string;
    type: 'alert' | 'confirm' | 'error';
    confirmText?: string;
    cancelText?: string;
}

export interface ModalResult {
    confirmed: boolean;
}