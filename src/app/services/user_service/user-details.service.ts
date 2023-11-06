import { Injectable } from '@angular/core';
import { loggedInUserDetails } from '../../models/loggedInUserDetails';


@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  constructor() { }

  userDetails: loggedInUserDetails = {} as loggedInUserDetails;

  public saveUserDetail(givenUserDetails: loggedInUserDetails): void {
    this.userDetails = givenUserDetails;
    localStorage.setItem('userDetails', JSON.stringify(givenUserDetails));
  }
  public getUserDetails() {
    const userDetailsString = localStorage.getItem('userDetails');
    return userDetailsString ? JSON.parse(userDetailsString) : null;
  }

  public getUserRole(): boolean {
    if (this.userDetails.role === "ADMIN") {
      return true;
    } else {
      return false;
    }
  }
}
