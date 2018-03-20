import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {

  constructor() { }
  edit = false;
  billingInformation = {
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
    this.billingInformation = form;
    console.log(form);
  }

}
