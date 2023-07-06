import { Component } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  loginValue: boolean = true;


  constructor(private router:Router){
  }

  ngOnInit(){
  }

  public redirectTo() {
    this.router.navigate(['/dashboard']);
    this.loginValue = false;
  }

  
}
