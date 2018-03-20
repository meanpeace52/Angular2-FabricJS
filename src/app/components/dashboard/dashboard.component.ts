import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";
import { SignupConfirmComponent } from '../signup-confirm/signup-confirm.component';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  providers: [HttpService]
})
export class DashboardComponent implements OnInit {

  constructor(private dialogService: DialogService, private activatedRoute: ActivatedRoute, private httpService:HttpService) {
  }

  ngOnInit() {
  	this.activatedRoute.queryParams.subscribe((params: Params) => {

		let signupConfirm = params['signupConfirm'];

		if(signupConfirm == 'true') {
			this.dialogService.addDialog(SignupConfirmComponent, {
				title:'',
				message:'',
			},{
				backdropColor: 'rgba(0, 0, 0, 0.5)'
			}
			).subscribe((isConfirmed)=>{
			});
		}
	});
	
  }

}
