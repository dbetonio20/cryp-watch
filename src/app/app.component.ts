import { Component, inject } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MinApiService } from 'src/services/min-api.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    firestore: Firestore = inject(Firestore);
    title = 'cryp-watch';
    items$: Observable<any[]>;

    constructor() {
      const aCollection = collection(this.firestore, 'items')
      this.items$ = collectionData(aCollection);
    }


}
