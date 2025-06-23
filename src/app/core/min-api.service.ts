/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface CryptoData {
    name: string;
    usd: number;
    php: number;
}

@Injectable({
    providedIn: 'root',
})
export class MinApiService {
    public cryptoData: CryptoData[] = [];

    constructor(private http: HttpClient) {}

    private apiUrl: string =
        'https://min-api.cryptocompare.com/data/pricemulti?fsyms=${cryptoCode}&tsyms=USD,PHP&api_key=';

    public getCryptoPrices(cryptoCode: string[]): Observable<CryptoData[]> {
        let cryptoCodeString;
        if (cryptoCode.length != 1) {
            cryptoCodeString = cryptoCode.join(','); // Join array elements into a comma-separated string
        } else {
            cryptoCodeString = cryptoCode[0];
        }

        return this.http
            .get<any>(
                `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${cryptoCodeString}&tsyms=USD,PHP&api_key=`
            )
            .pipe(
                map(data => {
                    const cryptoData: CryptoData[] = [];
                    for (const key in data) {
                        const currency = data[key];
                        cryptoData.push({
                            name: key,
                            usd: currency.USD,
                            php: currency.PHP,
                        });
                    }
                    return cryptoData;
                }),
                catchError(error => {
                    console.error('There was an error!', error);
                    return throwError(error);
                })
            );
    }
}
