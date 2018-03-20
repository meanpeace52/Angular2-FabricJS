import { Component, OnInit } from '@angular/core';
import { SingleProductService } from '../../services/single-product.service';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.css']
})
export class ThankYouComponent implements OnInit {

  public cardInfo: any;

  constructor(private spService: SingleProductService) { }

  ngOnInit() {
    this.cardInfo = this.spService.getCardInfo();
    console.log(this.cardInfo);    
  }

}
