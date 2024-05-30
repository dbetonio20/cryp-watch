import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CryptoData, MinApiService } from 'src/services/min-api.service';

interface MyData {
    name: string;
    usd: number;
    php: number;
    investment: number;
    boughtPriceInUSD: number;
    boughtPriceInPHP: number;
    gainOrLostPercentage: number;
    gain: number;
    overallGainOrLost: number;
  }


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: true,
    imports: [NgFor,NgIf, CommonModule]
})
export class HomeComponent implements OnInit {
    public cryptoData: CryptoData[] = [];
    public myData: MyData []= [];
    constructor(public minAPIService: MinApiService) { }

    ngOnInit() {
        this.minAPIService.getCryptoPrices().subscribe(
            data => {
                this.cryptoData = data;
                this.cryptoData.forEach(element => {
                    const boughtPrice = 65000;
                    const investmentTotal = 3000;
                    const gainOrLost = this.calculatePercentageChange(element.usd, boughtPrice);
                    const currentGainOrLost = this.calculateInvestment(boughtPrice,element.usd,investmentTotal);

                    this.myData.push({name: element.name, usd: element.usd, php: element.php,investment: investmentTotal, boughtPriceInUSD: boughtPrice,boughtPriceInPHP: boughtPrice, gainOrLostPercentage: gainOrLost, gain: currentGainOrLost - investmentTotal,overallGainOrLost: currentGainOrLost})
                });

            }
        )
    }

    public calculatePercentageChange(currentPrice: number, boughtPrice: number): number {
        const percentageChange = ((currentPrice - boughtPrice) / boughtPrice) * 100;
        return percentageChange;
    }

    public calculateInvestment(boughtPrice: number, currentPrice: number, investAmount: number): number {
        return (investAmount / boughtPrice) * currentPrice;
    }

    public addInvestment(){

    }

    public showModal: boolean = false;
    public toggleModal(){
      this.showModal = !this.showModal;
    }

}
