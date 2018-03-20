import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SingleProductService } from '../../services/single-product.service';
import { DialogService } from "ng2-bootstrap-modal";
import { CSVComponent } from '../csv-upload/csv.component';
import { HttpService } from '../../services/http.service';

import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Rx";

declare function unescape(s:string): string;
declare function escape(s:string): string;

@Component({
  selector: 'shopping-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [HttpService]
})

export class CartComponent implements OnInit {
  public frontImage: any;
  public backIamge: any;
  public showAlert: boolean = true;
  public label: string = "";
  public price: number = 0;
  public qty: number = 0;
  public csvContent: any[] = [];
  public cardType: string = "";
  public csvFile: any;
  public draftCard: any;

  public headers: Headers;

  constructor(private router: Router, public spService: SingleProductService, private dialogService: DialogService, private httpService:HttpService, private http:Http) {
    
    this.headers = new Headers({ 'Content-type': 'application/json' });

    this.frontImage = localStorage.getItem('front');
    this.backIamge = localStorage.getItem('back');
  }

  ngOnInit() {
    this.draftCard = this.spService.getDraftCard();
    this.label = this.draftCard.label;
    this.spService.clearCanvas(false);
    this.cardType = this.spService.getCardType();

    if(this.cardType == 'post') {
      this.dialogService.addDialog(CSVComponent, {
      }).subscribe((res)=>{
        if(res.confirm) {
          this.price = res.price;
          this.qty = res.qty;
          this.csvFile = res.csvFile;
        }        
        this.showAlert = false;
      });
    } else {
      this.showAlert = false;
    }
    
  }

  order() {
    var data = {
      frontImage: this.frontImage,
      backImage: this.backIamge,
      price: this.price,
      qty: this.qty
    };

    this.spService.setCardInfo(data);
    
    let that = this;   
    if(this.cardType == 'post') {
        if(!this.csvFile){
          alert("Please upload csv file");
          return;
        }

        let user_id = JSON.parse(localStorage.getItem('user'))._id;
        let formData:FormData = new FormData();  
        formData.append('files', this.dataURItoBlob(this.frontImage), 'front.png');
        formData.append('files', this.dataURItoBlob(this.backIamge), 'back.png');
        formData.append('files', this.csvFile);
        formData.append('user_id', user_id);

        this.httpService.uploadAddressers(formData).subscribe(
          res => {
            let handler = (<any>window).StripeCheckout.configure({
              key: 'pk_test_jHgqdqrXMWZQDn1MprK5Niq9',
              locale: 'auto',
              token: function (token: any) {
                let user = JSON.parse(localStorage.getItem('user'));
                that.httpService.thankyou({user: user}).subscribe(
                  res => {
                    that.router.navigate(['/thank-you']);
                  }, err => console.log(err)
                )                
              }
            });

            handler.open({
              name: 'Agent Cloud',
              description: 'postcard',
              amount: 2000
            });
            console.log(res);
          }, err => console.log(err)
        )
    }else {
      // this.httpService.authCimpress().subscribe(
      //     res => {
      //       let token = res.id_token;
      //       that.httpService.createDocumentOnCimpress(token).subscribe(
      //           res => {
      //             let DocumentReferenceUrl = decodeURIComponent(res.DocumentReferenceUrl);
      //             that.httpService.orderCimpress(token, DocumentReferenceUrl).subscribe(
      //                 res => {
      //                    console.log(res);                        
      //                 }, err => console.log(err)
      //             )
      //           }, err => console.log(err)
      //       )
      //     }, err => console.log(err)
      // )
      let handler = (<any>window).StripeCheckout.configure({
        key: 'pk_test_jHgqdqrXMWZQDn1MprK5Niq9',
        locale: 'auto',
        token: function (token: any) {
          let user = JSON.parse(localStorage.getItem('user'));
          that.httpService.thankyou({user: user}).subscribe(
            res => {
              that.router.navigate(['/thank-you']);
            }, err => console.log(err)
          ) 
        }
      });

      handler.open({
        name: 'Agent Cloud',
        description: 'postcard',
        amount: 2000
      });
    }
  }

  dataURItoBlob(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1]);
      else
          byteString = unescape(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], {type:mimeString});
  }

  getCurrentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();

    return (mm.toString() + dd.toString() + yyyy.toString() + "-" + hours.toString() + minutes.toString())
  }

  changeLabel() {    
    let that = this;
    let savedDrafts = JSON.parse(localStorage.getItem('savedDrafts'));
    let date = this.getCurrentDate();

    savedDrafts.forEach(function(draft, index){
      if(draft.id == that.draftCard.id){
        savedDrafts[index] = that.draftCard = {
          id: that.draftCard.id,
          frontState: that.draftCard.frontState,
          frontImage: that.draftCard.frontImage,
          backState: that.draftCard.backState,
          backImage: that.draftCard.backImage,
          label: that.label!= "" ? that.label : date,
          cardType: that.cardType
        }
      }
    });

    this.spService.setDraftCard(this.draftCard);
    localStorage.setItem('savedDrafts', JSON.stringify(savedDrafts));

    // var key = 'draftedImage_' + this.cardType;
    // var savedDraft = JSON.parse(localStorage.getItem(key));
    // var date = this.getCurrentDate();
    // savedDraft.label = this.label + "-" + date;
    // localStorage.setItem(key, JSON.stringify(savedDraft));
  }
}
