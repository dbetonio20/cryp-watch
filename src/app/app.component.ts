import { Component, inject, Input, ViewChild } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { IonRefresher, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { MinApiService } from 'src/services/min-api.service';
import { HomeComponent } from './components/home/components/home.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    @ViewChild('home', { static: true }) home: HomeComponent;
    title = 'cryp-watch';
    public isDesktop = false;

    public isLoading: boolean = false;

    constructor(public platform: Platform) {
      console.log(platform.platforms());
      if(platform.platforms().includes('desktop')) {
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
