import { Component, OnInit } from '@angular/core';
import { DialogService } from "ng2-bootstrap-modal";
import { AlertComponent } from '../alert-modal/alert.component';
import { SingleProductService } from '../../services/single-product.service';

@Component({
  selector: 'saved-draft',
  templateUrl: './saved-draft.component.html',
  styleUrls: ['./saved-draft.component.css']
})

export class SavedDraftComponent implements OnInit {
  public draftedImages: any[] = [];
  public savedDrafts: any[] = [];
  
  constructor(private dialogService: DialogService, public spService: SingleProductService) {}

  ngOnInit() {
    let savedDrafts = JSON.parse(localStorage.getItem('savedDrafts'));
    if(savedDrafts)
      this.savedDrafts = savedDrafts;
  }

  getState(state) {
    if(state.length > 0) {
      return true;
    } else
      return false;
  }

  goToSinglePage = function (value, image, draft) {    
    this.showAlert = true;
    this.spService.setCardType(value);
    this.spService.setDraftCard(draft);
    this.dialogService.addDialog(AlertComponent, {
      cardType: value,
      originalImage: image
    }).subscribe((isConfirmed)=>{
      this.showAlert = false;
    });

  }
}
