import { Component } from '@angular/core';
import { ApiService } from '../services/API_service/api.service';
import { User } from '../models/User';
import { NgForm } from '@angular/forms';
import { House } from '../models/House';
import { UserDto } from '../models/userDto';
import { UserDetailsService } from '../services/user_service/user-details.service';

declare var $: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {

  users: User[] = [];
  houses: House[] = [];
  housesWithNoOwner: House[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  selectedStreet: string = '';
  searchedUsers: User[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
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
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;

  constructor(private apiServices: ApiService, private userDetailService: UserDetailsService) {
    this.apiServices.getAllHouses().subscribe((houses: House[]) => {
      this.houses = houses; // Update houses array when data changes
      this.filterHousesWithNoOwner();
    });
    this.apiServices.getAllUsers().subscribe((users: User[]) => {
      this.users = users; // Update houses array when data changes
      this.filteredUsers = this.users;
    });

    const userDetails = this.userDetailService.getUserDetails();
    if (userDetails) {
      if (userDetails.role === "ADMIN" || userDetails.role === "SUPERADMIN") {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    }
    if (userDetails) {
      if (userDetails.role === "SUPERADMIN") {
        this.isSuperAdmin = true;
      } else {
        this.isSuperAdmin = false;
      }
    }
  }

  ngOnInit() {
    this.apiServices.getAllHouses().subscribe((houses: House[]) => {
      this.houses = houses; // Update houses array when data changes
    });
    this.apiServices.getAllUsers().subscribe((users: User[]) => {
      this.users = users; // Update houses array when data changes
    });
  }

  deleteUser(user: User) {
    this.apiServices.deleteUser(user.id);
  }

  saveEditedUser(editedUser: NgForm) {
    console.log(editedUser.value)
    this.apiServices.saveUsersInfo(editedUser.value)
  }

  saveNewUser(newUser: NgForm) {
    this.apiServices.saveNewUser(newUser.value)
  }

  closeModal(modalId: string): void {
    $('#' + modalId).modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  public filterHousesWithNoOwner() {
    this.housesWithNoOwner = this.houses.filter(house => house.user.id === null)
  }


  getAllStreets(): Set<string> {
    const streets = new Set<string>();
    for (const house of this.houses) {
      if (!streets.has(house.streetName))
        streets.add(house.streetName)
    }
    return streets;
  }

  searchUsers(): User[] {
    this.filteredUsers = this.users;
    this.searchedUsers = [];
    if (this.selectedStreet === null || this.selectedStreet === '') {
      if (this.searchTerm === null || this.searchTerm === 'Search in all') {
        return this.filteredUsers = this.users;
      } else {
        for (const user of this.users) {
          if (user.firstName.includes(this.searchTerm) || user.lastName.includes(this.searchTerm)) {
            this.searchedUsers.push(user)
          }
        }
        return this.filteredUsers = this.searchedUsers;
      }
    } else {
      this.filteredUsers = this.users.filter(user => user.house.streetName === this.selectedStreet)
      for (const user of this.filteredUsers) {
        if (user.firstName.includes(this.searchTerm) || user.lastName.includes(this.searchTerm)) {
          this.searchedUsers.push(user)
        }
      }
      return this.filteredUsers = this.searchedUsers;
    }
  }

  onStreetSelect(event: Event) {
    this.selectedStreet = (event.target as HTMLSelectElement).value;
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endIndex(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.filteredUsers.length ? this.filteredUsers.length : end;
  }

  get totalRows(): number {
    return this.filteredUsers.length;
  }

  updatePage(page: number): void {
    this.currentPage = page;
  }

  onItemsPerPageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(target.value, 10);
  }



}
