import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetailsService } from '../services/user-details.service';
import { loggedInUserDetails } from '../models/loggedInUserDetails';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  isNavbarCollapsed = true;


  constructor(private router: Router){
  }

  ngOnInit(): void {
  }

  public logout(){
    localStorage.setItem('isAuthenticated', 'false')
    localStorage.setItem('myToken', "")
    this.router.navigate(['/home'])
  }
  
}
