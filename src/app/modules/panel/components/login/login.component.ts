import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ILoginData } from '../../interfaces/ilogin-data';
import { LoginDataService } from '../../services/login-data.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  credentials: ILoginData;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private loginDataService: LoginDataService, private commonService: CommonService, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl(),
      password: new FormControl()
    })

    this.fetchLoginData(); 
  }

  /**
   * To fetch Login Data into the component
   */
  fetchLoginData(){
    this.loginDataService.getLoginData().subscribe((res : ILoginData) => {
      console.log('login data ', res);
      this.credentials = res;
    });
  }

  /**
   * To check if filled credetials are correct
   */
  login(){
    if(this.loginForm.value.username == this.credentials.username && this.loginForm.value.password == this.credentials.password){
      this.commonService.openSnackBar('Successfully Logged In', 'success');
      this.router.navigate(['/dashboard']);
    }
    else{
      this.commonService.openSnackBar('Wrong Username or Password', 'error');
    }
  }

}
