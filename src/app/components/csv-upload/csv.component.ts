import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { SingleProductService } from '../../services/single-product.service';
import { Http, Response } from '@angular/http';

export interface ConfirmModel {
}

@Component({
  selector: 'csv',
  templateUrl: './csv.component.html',
  styleUrls: ['./csv.component.css']
})
export class CSVComponent extends DialogComponent<ConfirmModel, any> {

  public price: number;
  public qty: number;
  public csvContent: any;
  public csvFile: any;

  constructor(private router: Router, dialogService: DialogService, public spService: SingleProductService, private http: Http) {
    super(dialogService);
  }

  readCsvData(evt) {
    var self = this;
    var files = evt.target.files;
    self.csvFile = files[0];
    
    var reader = new FileReader();
    reader.readAsText(self.csvFile);

    reader.onload = function(f){
      var target: any = f.target;
      self.qty = self.extractData(target.result);
      self.price = Math.round(self.qty / 100) * 100;
      self.confirm();
    }

  }

  private extractData(data) {
    var csvData = data;
    var allTextLines = csvData.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    this.csvContent = [];

    for ( var i = 0; i < allTextLines.length; i++) {
      var data = allTextLines[i].split(',');
      if (data.length == headers.length) {
        var tarr = [];
        for ( var j = 0; j < headers.length; j++) {
          tarr.push(data[j]);
        }
        this.csvContent.push(tarr);
      }
    }
    return (this.csvContent.length - 1)
  }

  confirm() {
    this.result = {
      price: this.price,
      qty: this.qty,
      csvFile: this.csvFile,
      confirm: true
    };
    
    this.close();
  }

  cancel() {
    this.result = {
      confirm: false
    };
    this.close();
  }
}