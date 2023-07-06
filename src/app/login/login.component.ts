import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthRequest } from '../models/auth-request';
import { loggedInUserDetails } from '../models/loggedInUserDetails';
import { AuthResponse } from '../models/auth-response';
import { UserDetailsService } from '../services/user-details.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = "";
  password: string = "";
  myTokenObject :any = "";
  tokenStringValue: string = "";
  isAuthenticated: string = "";

  userInfo: loggedInUserDetails = {} as loggedInUserDetails;
  authResponse:any;

  constructor(private httpClient: HttpClient, private router:Router, private apiServices: ApiService, private userDetailsService: UserDetailsService) { 
  }

  public doLogin() {
    
    let tokenResponse = this.getAuthTokenFromBackend();
    tokenResponse.subscribe(data => {
      this.authResponse = data; 
      const responseObject = JSON.parse(this.authResponse);
      this.tokenStringValue = responseObject.token;
      this.userInfo = responseObject.user; 
      this.userDetailsService.saveUserDetail(this.userInfo);
      localStorage.setItem('myToken', this.tokenStringValue); 
      localStorage.setItem('isAuthenticated', "true")
      this.router.navigate(["/dashboard"]);
    });
  }

  public getAuthTokenFromBackend() : Observable<Object> {
    const encryptedLoginAndPass = btoa(this.email + ":" + this.password); //uzkoduoja duota stringa
    const headers = new HttpHeaders().set("Authorization", 'Basic ' + encryptedLoginAndPass);
    const requestBody: AuthRequest = { email: this.email, password: this.password };
    return this.httpClient.post("http://localhost:8080/auth/authenticate", requestBody, { headers, responseType: 'text' as 'json'});
  }
  
}
