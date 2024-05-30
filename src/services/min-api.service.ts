import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface CryptoData {
    name: string;
    usd: number;
    php: number;
}

@Injectable({
    providedIn: 'root'
})
export class MinApiService {
    public cryptoData: CryptoData[] = [];

    constructor(private http: HttpClient) { }

    private apiUrl: string = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD,PHP&api_key='



    public getCryptoPrices(): Observable<CryptoData[]> {
        return this.http.get<any>(this.apiUrl).pipe(
            map(data => {
              for(const key in data) {
                const currency = data[key];
                this.cryptoData.push({name: key, usd: currency.USD, php: currency.PHP});
              }
              return this.cryptoData;
            }), // You can transform the data here if needed
            catchError(error => {
                console.error('There was an error!', error);
                return throwError(error);
            })
        );
    }


}
