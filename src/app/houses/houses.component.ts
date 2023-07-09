import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { House } from '../models/House';
import { NgForm } from '@angular/forms';
import { UserDetailsService } from '../services/user-details.service';
import { User } from '../models/User';

declare var $: any;

@Component({
  selector: 'app-houses',
  templateUrl: './houses.component.html',
  styleUrls: ['./houses.component.css']
})
export class HousesComponent {

  houses: House[] = [];

  newHouse: House = {
    id : '',
    streetName: '',
    houseNumber: '',
    user: {} as User
  }

  isAdmin:boolean = false;

  

  constructor(private router: Router, private apiService: ApiService, private cdr: ChangeDetectorRef, private userDetailService: UserDetailsService){
    this.apiService.getAllHouses().subscribe((houses: House[]) => {
      this.houses = houses; // Update houses array when data changes
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
    this.apiService.getAllHouses().subscribe((houses: House[]) => {
      this.houses = houses; // Update houses array when data changes
    });
  }

  public saveNewHouse(newHouseDetails: NgForm){
    this.apiService.saveHouseInfo(newHouseDetails.value);
  }
  public deleteHouse(house: House) {
    this.apiService.deleteHouse(house.id);
  }
  public saveEditedHouse(houseDetails: NgForm){
    this.apiService.updateHouseInfo(houseDetails.value);
  }

  closeModal(modalId: string): void {
    $('#' + modalId).modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

}
