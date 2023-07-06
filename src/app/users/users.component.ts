import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { User } from '../models/User';
import { NgForm } from '@angular/forms';
import { House } from '../models/House';
import { UserDto } from '../models/userDto';
import { UserDetailsService } from '../services/user-details.service';

declare var $: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {

  users: User[] = [];

  houses: House[] = [];

  newUser: UserDto = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    houseId: '',
    phoneNumber: '',
    bankAccount: '',
    enabled: false
  }

  isAdmin:boolean = false;

  constructor(private apiServices: ApiService, private userDetailService: UserDetailsService){
    this.apiServices.getAllHouses().subscribe((houses: House[]) => {
      this.houses = houses; // Update houses array when data changes
    });
    this.apiServices.getAllUsers().subscribe((users: User[]) => {
      this.users = users; // Update houses array when data changes
    });

    const userDetails = this.userDetailService.getUserDetails();
    if (userDetails) {
      if (userDetails.role === "ADMIN") {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    }
  }

  ngOnInit(){
    this.apiServices.getAllHouses().subscribe((houses: House[]) => {
      this.houses = houses; // Update houses array when data changes
    });
    this.apiServices.getAllUsers().subscribe((users: User[]) => {
      this.users = users; // Update houses array when data changes
    });
  }

  public deleteUser(user: User){
    this.apiServices.deleteUser(user.id);
  }

  public saveEditedUser(editedUser: NgForm){
    this.apiServices.saveUsersInfo(editedUser.value)
  }

  public saveNewUser(newUser: NgForm){
    this.apiServices.saveNewUser(newUser.value)
  }

  closeModal(modalId: string): void {
    $('#' + modalId).modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }
}
