import { Component } from '@angular/core';
import { loggedInUserDetails } from '../models/loggedInUserDetails';
import { UserDetailsService } from '../services/user-details.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ApiService } from '../services/api.service';

declare var $: any;

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.css']
})
export class UserInformationComponent {

  loggedInUser: loggedInUserDetails = {} as loggedInUserDetails;


  constructor(private router: Router, private userDetailsInfoService: UserDetailsService, private apiService: ApiService){
    const userDetails = this.userDetailsInfoService.getUserDetails();
    if (userDetails) {
      this.loggedInUser = userDetails;
    }
  }

  ngOnInit(): void {
    const userDetails = this.userDetailsInfoService.getUserDetails();
    if (userDetails) {
      this.loggedInUser = userDetails;
    }
  }

  public editMyUser(myEditedUser: NgForm){
    this.apiService.saveUsersInfo(myEditedUser.value)
  }

  closeModal(modalId: string): void {
    $('#' + modalId).modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

}
