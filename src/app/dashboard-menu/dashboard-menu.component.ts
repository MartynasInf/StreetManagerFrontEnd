import { Component } from '@angular/core';
import { UserDetailsService } from '../services/user-details.service';

@Component({
  selector: 'app-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.css']
})
export class DashboardMenuComponent {

  isAdmin:boolean = false;

  constructor(private userDetailService: UserDetailsService){

  const userDetails = this.userDetailService.getUserDetails();
    if (userDetails) {
      if (userDetails.role === "ADMIN") {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    }
  }

}
