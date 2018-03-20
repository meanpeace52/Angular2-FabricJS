import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css']
})
export class ShippingComponent implements OnInit {

  constructor() { }
  edit = false;
  shippingInformation = {
    address: '1001 Wilshire Blvd',
    city: 'Los Angeles',
    state: 'California',
    country: 'United States of America',
    zip: '90017',
    company: 'Agent Cloud',
    fax: '1-800-626-0106'
  }
  ngOnInit() {
  }


  save(form){
    this.edit = false;
    this.shippingInformation = form;
    console.log(form);
  }
}
