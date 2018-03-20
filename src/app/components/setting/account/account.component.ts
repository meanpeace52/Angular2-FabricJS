import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [HttpService]
})
export class AccountComponent implements OnInit {
  private edit: boolean = false;
  private url: String;
  private preview: boolean = false;
  private accountInformation: Object;
  private user: Object;

  constructor(private httpService:HttpService) {
    this.user = JSON.parse(localStorage.getItem('user'));

    if(!this.user) {
      this.user = {
        firstName: '',
        lastName: '',
        email: '',
        cellPhone: '',
        telePhone: '',
        breNumber: '',
        fax: '',
        website: ''
      }
    }

    this.accountInformation = {
      firstName: this.user['firstName'],
      lastName: this.user['lastName'],
      email: this.user['email'],
      cellPhone: this.user['cellPhone'],
      telePhone: this.user['telePhone'],
      breNumber: this.user['breNumber'],
      fax: this.user['fax'],
      website: this.user['website']
    }

  }

  ngOnInit() {
  }

  save(form){
    if(form.password || form.confirmPassword) {
      if(form.password !== form.confirmPassword){
        alert("Password does not match!");
        this.edit = false;
        return;
      }
    }

    let params = {
      _id: this.user['_id'],
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      cellPhone: form.cellPhone,
      telePhone: form.telePhone,
      breNumber: form.breNumber,
      fax: form.fax,
      website: form.website,
      password: form.password
    }
    this.httpService.updateProfile(params).subscribe(
      res => {
        localStorage.setItem('user', JSON.stringify(res.data));
        this.edit = false;
        this.accountInformation = form;
      }, err => console.log(err)
    )
  }
  
  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event:any) => {
        this.url = event.target.result;
      }

      reader.readAsDataURL(event.target.files[0]);
      this.preview = true;
    }
  }
}
