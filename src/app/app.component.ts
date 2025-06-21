/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class AppComponent {
    @ViewChild('home', { static: true }) home: HomeComponent;
    title = 'cryp-watch';
    public isDesktop = false;

    public isLoading: boolean = false;

    constructor() {
        // Detect desktop platform using window object
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isDesktop = !isMobile;
        console.log('Platform:', this.isDesktop ? 'desktop' : 'mobile');
    }

    public handleRefresh(event: any) {
        setTimeout(() => {
            // this.home.getUpdatedCryptoData();
            event.target.complete();
        }, 2000);
    }
}
