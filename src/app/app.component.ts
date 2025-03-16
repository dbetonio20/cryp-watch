/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HomeComponent } from './features/home/home.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    @ViewChild('home', { static: true }) home: HomeComponent;
    title = 'cryp-watch';
    public isDesktop = false;

    public isLoading: boolean = false;

    constructor(public platform: Platform) {
        console.log(platform.platforms());
        if (platform.platforms().includes('desktop')) {
            this.isDesktop = true;
        }
    }

    public handleRefresh(event: any) {
        setTimeout(() => {
            this.home.getUpdatedCryptoData();
            event.target.complete();
        }, 2000);
    }
}
