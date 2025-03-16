/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {
    Component,
    inject,
    OnInit,
    signal,
    WritableSignal,
    OnDestroy,
} from '@angular/core';
import { CryptoData, MinApiService } from 'src/app/core/min-api.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AddCryptoComponent } from '../add-crypto/add-crypto.component';
import {
    addDoc,
    collection,
    collectionData,
    CollectionReference,
    deleteDoc,
    doc,
    Firestore,
    getDocs,
    query,
    updateDoc,
    where,
} from '@angular/fire/firestore';
import {
    catchError,
    concatMap,
    finalize,
    from,
    map,
    Observable,
    Subscription,
    tap,
    zip,
} from 'rxjs';

interface InvestmentData {
    coin: string;
    usd: number;
    php: number;
    investment: number;
    boughtPriceInUSD: number;
    gainOrLostPercentage: number;
    gain: number;
    overallGainOrLost: number;
}

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: true,
    imports: [NgFor, NgIf, CommonModule, MatButtonModule, MatDialogModule],
})
export class HomeComponent implements OnInit, OnDestroy {
    firestore: Firestore = inject(Firestore);
    items$: Observable<unknown[]>;

    public aCollection: CollectionReference;
    public investmentData: WritableSignal<InvestmentData[]> = signal([]);
    public isLoading: WritableSignal<boolean> = signal(false);

    private cryptoData: WritableSignal<CryptoData[]> = signal([]);
    private subscription: Subscription;

    constructor(
        public minAPIService: MinApiService,
        public dialog: MatDialog
    ) {
        this.aCollection = collection(this.firestore, 'investment');
    }

    ngOnInit() {
        this.initializeCollection();
    }

    private initializeCollection() {
        this.isLoading.set(true);
        this.aCollection = collection(this.firestore, 'investment');
        collectionData(this.aCollection, { idField: 'id' })
            .pipe(
                // Add idField option here
                tap(data => console.log('Firestore data:', data)),
                map(data => {
                    return data.map((element: any) => {
                        const investmentTotal = element.investment;
                        const gainOrLost = this.calculatePercentageChange(
                            element.usd,
                            element.boughtPriceInUSD
                        );
                        const currentGainOrLost = this.calculateInvestment(
                            element.boughtPriceInUSD,
                            element.usd,
                            investmentTotal
                        );

                        return {
                            id: element.id, // Include the document ID
                            coin: element.coin,
                            usd: element.usd,
                            php: element.php,
                            investment: investmentTotal,
                            boughtPriceInUSD: element.boughtPriceInUSD,
                            gainOrLostPercentage: gainOrLost,
                            gain: currentGainOrLost - investmentTotal,
                            overallGainOrLost: currentGainOrLost,
                        };
                    });
                }),
                tap(mappedData => {
                    this.investmentData.set(mappedData);
                    this.isLoading.set(false);
                    console.log('Mapped data:', this.investmentData);
                })
            )
            .subscribe();
    }

    public calculatePercentageChange(
        currentPrice: number,
        boughtPrice: number
    ): number {
        const percentageChange =
            ((currentPrice - boughtPrice) / boughtPrice) * 100;
        return percentageChange;
    }

    public calculateInvestment(
        boughtPrice: number,
        currentPrice: number,
        investAmount: number
    ): number {
        return (investAmount / boughtPrice) * currentPrice;
    }

    public showModal: boolean = false;
    public openDialog() {
        this.dialog
            .open(AddCryptoComponent, {
                panelClass: 'custom-dialog-container',
            })
            .afterClosed()
            .subscribe(data => {
                if (data) {
                    this.getCryptoData(data);
                }
            });
    }

    public getCryptoData(crypto: any) {
        if (!crypto || !crypto.coinName) {
            console.error('Invalid crypto data provided');
            return;
        }

        this.minAPIService.getCryptoPrices([crypto.coinName]).subscribe(
            data => {
                if (!data || !Array.isArray(data)) {
                    console.error('Invalid data received from API');
                    return;
                }

                this.cryptoData.set(data);
                this.cryptoData().forEach(element => {
                    this.saveToFirestore(element, crypto);
                    const boughtPrice = crypto.boughtPrice;
                    const investmentTotal = crypto.investment;
                    const gainOrLost = this.calculatePercentageChange(
                        element.usd,
                        boughtPrice
                    );
                    const currentGainOrLost = this.calculateInvestment(
                        boughtPrice,
                        element.usd,
                        investmentTotal
                    );
                    this.investmentData().push({
                        coin: element.name,
                        usd: element.usd,
                        php: element.php,
                        investment: investmentTotal,
                        boughtPriceInUSD: boughtPrice,
                        gainOrLostPercentage: gainOrLost,
                        gain: currentGainOrLost - investmentTotal,
                        overallGainOrLost: currentGainOrLost,
                    });
                });
            },
            error => {
                console.error('Error fetching crypto prices:', error);
            }
        );
    }

    public saveToFirestore(element: any, crypto: any) {
        const boughtPrice = crypto.boughtPrice;
        const investmentTotal = crypto.investment;
        const gainOrLost = this.calculatePercentageChange(
            element.usd,
            boughtPrice
        );
        const currentGainOrLost = this.calculateInvestment(
            boughtPrice,
            element.usd,
            investmentTotal
        );
        addDoc(this.aCollection, {
            coin: element.name,
            usd: element.usd,
            php: element.php,
            investment: investmentTotal,
            boughtPriceInUSD: boughtPrice,
            gainOrLostPercentage: gainOrLost,
            gain: currentGainOrLost - investmentTotal,
            overallGainOrLost: currentGainOrLost,
        });
    }

    public currentPrice: any;
    public getUpdatedCryptoData() {
        this.isLoading.set(true);
        const coins = this.investmentData().map(data => data.coin);
        this.minAPIService
            .getCryptoPrices(coins)
            .pipe(
                finalize(() => {
                    const coinsToUpdate = coins.filter(
                        (element, index) => coins.indexOf(element) === index
                    );
                    this.updatePrice(coinsToUpdate);
                })
            )
            .subscribe(
                data => {
                    this.currentPrice = data;
                },
                error => {
                    console.error('Error fetching crypto data:', error);
                }
            );
    }

    private updatePrice(coins: string[]) {
        // Create an observable for each coin's update operation
        const observables = coins.map((coinName, index) => {
            const dataQuery = query(
                collection(this.firestore, 'investment'),
                where('coin', '==', coinName)
            );
            return from(getDocs(dataQuery)).pipe(
                concatMap(querySnapshot =>
                    querySnapshot.docs.map(doc => {
                        const updateData = {
                            usd: this.currentPrice[index].usd,
                            php: this.currentPrice[index].php,
                        };
                        return updateDoc(doc.ref, updateData).then(
                            () => doc.id
                        );
                    })
                ),
                catchError(error => {
                    console.error('Error updating document:', error);
                    return [];
                })
            );
        });

        // Use zip to execute all observables concurrently
        zip(...observables)
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe(ids => {
                ids.forEach(id =>
                    console.log(
                        'USD and PHP prices successfully updated for document:',
                        id
                    )
                );
            });
    }

    public deleteCoin(data: any) {
        this.deleteDocument('investment', data.id);
    }

    public deleteDocument(collectionName: string, docId: string) {
        const docRef = doc(this.firestore, `${collectionName}/${docId}`);
        deleteDoc(docRef)
            .then(() => {
                console.log('Document successfully deleted!');
            })
            .catch(error => {
                console.error('Error removing document: ', error);
            });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
