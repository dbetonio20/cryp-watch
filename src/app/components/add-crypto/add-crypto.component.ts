import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-crypto',
  templateUrl: './add-crypto.component.html',
  styleUrls: ['./add-crypto.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class AddCryptoComponent {
  public coinName: string  = '';
  public investment: number = 0;
  public boughtPrice: number = 0;

  constructor(private dialogRef: MatDialogRef<AddCryptoComponent>) { }

  ngOnInit() {

  }

  public save() {
    this.dialogRef.close({coinName: this.coinName, investment: this.investment, boughtPrice: this.boughtPrice});
  }

}
