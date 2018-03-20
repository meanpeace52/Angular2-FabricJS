import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { SingleProductService } from '../../services/single-product.service';

export interface ConfirmModel {
  cardType: string;
  originalImage: string;
}

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent extends DialogComponent<ConfirmModel, boolean> implements ConfirmModel {

  cardType: string;
  originalImage: string;
  layoutPanel: string = 'horizontal';
  sizePanel: string = 'large';

  constructor(private router: Router, dialogService: DialogService, public spService: SingleProductService) {
    super(dialogService);
    this.spService.setLayout('horizontal');
    this.spService.setSizePanel('large');
  }

  setLayoutPanel(value) {
    this.layoutPanel = value
    this.spService.setLayout(value);
  }

  setSizePanel(value) {
    this.sizePanel = value
    this.spService.setSizePanel(value);
  }

  confirm() {
    this.result = true;
    this.close();
    this.spService.clearCanvas(true);
    this.router.navigate(['/single-product']);  
  }

  cancel() {
    this.result = false;
    this.close();
  }
}