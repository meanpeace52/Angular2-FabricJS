import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.css']
})
export class CreditComponent implements OnInit {

  constructor() { }
  edit = false;
  credit = {
    card: 'Master Card',
    zip: '90017',
    month: '11',
    year: '18',
    code: 'XXX'
  }
  ngOnInit() {
  }

  save(form){
    this.edit = false;
    this.credit = form;
    console.log(form);
  }

}
