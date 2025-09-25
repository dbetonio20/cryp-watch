/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {
    Component,
    computed,
    inject,
    OnInit,
    signal,
    WritableSignal,
    OnDestroy,
    Inject,
} from '@angular/core';
import { CryptoData, MinApiService } from 'src/app/core/min-api.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
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
    forkJoin,
    from,
    map,
    Observable,
    of,
    Subscription,
    tap,
    zip,
} from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';
import { User } from '@angular/fire/auth';
import { AddCryptoComponent } from '../add-crypto/add-crypto.component';

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
    standalone: true,
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    imports: [CommonModule, NgFor, NgIf, MatButtonModule, MatDialogModule]
})
export class HomeComponent implements OnInit, OnDestroy {
    firestore: Firestore = inject(Firestore);
    items$: Observable<unknown[]>;
    authService = inject(AuthService);
    router = inject(Router);

    public investmentCollectionRef: CollectionReference;
    public investmentData: WritableSignal<InvestmentData[]> = signal([]);
    public isLoading: WritableSignal<boolean> = signal(false);
    public exchangeRate: WritableSignal<number> = signal(58.27); // Default to user's value

    public totalInvestment = computed(() => this.investmentData().reduce((sum, item) => sum + item.investment, 0));
    public totalOverall = computed(() => this.investmentData().reduce((sum, item) => sum + item.overallGainOrLost, 0));
    public totalGainLoss = computed(() => this.totalOverall() - this.totalInvestment());
    public totalOverallPHP = computed(() => this.totalOverall() * this.exchangeRate());
    public totalInvestmentPHP = computed(() => this.totalInvestment() * this.exchangeRate());
    public totalGainLossPHP = computed(() => this.totalGainLoss() * this.exchangeRate());

    private cryptoData: WritableSignal<CryptoData[]> = signal([]);
    private subscription: Subscription;
    private uID: string | undefined;

    constructor(
        public minAPIService: MinApiService,
        @Inject(MatDialog) public dialog: MatDialog
    ) {
        this.investmentCollectionRef = collection(this.firestore, 'investment');
    }

    ngOnInit() {
        this.initializeCollection();
        this.minAPIService.getExchangeRate().subscribe(rate => this.exchangeRate.set(rate));
    }

    private initializeCollection(): void {
        this.authService.user$.subscribe(user => {
            this.uID = user?.uid;
        });
       
        if (!this.uID) {
            console.error("User not authenticated");
            return;
        }
    
        this.isLoading.set(true);
    
        // Reference the authenticated user's investment collection
        this.investmentCollectionRef = collection(this.firestore, `users/${this.uID}/investments`);
    
        this.subscription = collectionData(this.investmentCollectionRef, { idField: 'id' })
            .pipe(
                tap(data => console.log('Fetched Firestore data:', data)),
                map(data =>
                    data.map(element => {
                        const { id, coin, usd, php, investment, boughtPriceInUSD } = element;
                        const gainOrLostPercentage = this.calculatePercentageChange(usd, boughtPriceInUSD);
                        const overallGainOrLost = this.calculateInvestment(boughtPriceInUSD, usd, investment);
                        const gain = overallGainOrLost - investment;
    
                        return {
                            id,
                            coin,
                            usd,
                            php,
                            investment,
                            boughtPriceInUSD,
                            gainOrLostPercentage,
                            gain,
                            overallGainOrLost
                        };
                    })
                ),
                tap(mappedData => {
                    this.investmentData.set(mappedData);
                    this.isLoading.set(false);
                    console.log('Processed Investment Data:', mappedData);
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
        if (!this.uID) {
            console.error("User not authenticated");
            return;
        }
    
        const boughtPrice = crypto.boughtPrice;
        const investmentTotal = crypto.investment;
        const gainOrLost = this.calculatePercentageChange(element.usd, boughtPrice);
        const currentGainOrLost = this.calculateInvestment(boughtPrice, element.usd, investmentTotal);
    
        // Reference to the authenticated user's investments subcollection
        const investmentCollectionRef = collection(this.firestore, `users/${this.uID}/investments`);
    
        addDoc(investmentCollectionRef, {
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
        if (!this.uID) {
            console.error("User not authenticated");
            this.isLoading.set(false);
            return;
        }
    
        // Create an observable for each coin's update operation
        const observables = coins.map((coinName, index) => {
            const dataQuery = query(
                collection(this.firestore, `users/${this.uID}/investments`),
                where('coin', '==', coinName)
            );
    
            return from(getDocs(dataQuery)).pipe(
                concatMap(querySnapshot =>
                    forkJoin(
                        querySnapshot.docs.map(doc => {
                            const updateData = {
                                usd: this.currentPrice[index].usd,
                                php: this.currentPrice[index].php,
                            };
                            return from(updateDoc(doc.ref, updateData)).pipe(
                                map(() => doc.id)
                            );
                        })
                    )
                ),
                catchError(error => {
                    console.error('Error updating document:', error);
                    return of([]);
                })
            );
        });
    
        // Execute all observables concurrently
        zip(...observables)
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe(ids => {
                ids.flat().forEach(id =>
                    console.log(
                        'USD and PHP prices successfully updated for document:',
                        id
                    )
                );
            });
    }
    

    public deleteCoin(data: any) {      
        if (!this.uID) {
            console.error("User not authenticated");
            return;
        }
        this.deleteDocument(`users/${this.uID}/investments`, data.id);
    }

    public deleteDocument(collectionPath: string, docId: string) {
        const docRef = doc(this.firestore, `${collectionPath}/${docId}`);
        deleteDoc(docRef)
            .then(() => {
                console.log('Document successfully deleted!');
            })
            .catch(error => {
                console.error('Error removing document: ', error);
            });
    }
    

    onLogout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
