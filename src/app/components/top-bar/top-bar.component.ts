import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  providers: [HttpService]
})
export class TopBarComponent implements OnInit {
	private user:Object;

	constructor(private activatedRoute: ActivatedRoute, private httpService:HttpService) {
		
		// For Testing
		if(!this.user) {
			this.user = {
		        firstName: '',
		        lastName: '',
		        email: '',
		        cellPhone: '',
		        telePhone: '',
		        breNumber: '',
		        fax: '',
		        website: '',
		        photo: ''
		    }
		}
	}

	ngOnInit() {
		let that = this;
		
		this.activatedRoute.queryParams.subscribe((params: Params) => {
			let token = params['token'];
			if(token && token.length > 0){
				this.httpService.getProfileInfo(token).subscribe(
					res => {
						localStorage.setItem('ac_token', token);
						localStorage.setItem('user', JSON.stringify(res.data));
						this.user = res.data;
					}, err => {
						console.log(err);
						window.location.href = 'http://agentcloud.com/';
					}
				)
			}else {
				setTimeout(function() {
					let token = localStorage.getItem('ac_token');
					that.user = JSON.parse(localStorage.getItem('user'));

					// For Testing
					if(!that.user){
						that.user = {
					        firstName: '',
					        lastName: '',
					        email: '',
					        cellPhone: '',
					        telePhone: '',
					        breNumber: '',
					        fax: '',
					        website: '',
					        photo: ''
					    }
					}

				});
			}
		});
	}

	ngAfterViewInit() {
	}
}
