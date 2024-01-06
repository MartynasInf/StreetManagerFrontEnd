import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/API_service/api.service';
import { House } from '../models/House';
import { NgForm } from '@angular/forms';
import { UserDetailsService } from '../services/user_service/user-details.service';
import { User } from '../models/User';

declare var $: any;

@Component({
  selector: 'app-houses',
  templateUrl: './houses.component.html',
  styleUrls: ['./houses.component.css']
})
export class HousesComponent {

  houses: House[] = [];
  searchTerm: string = '';
  newHouse: House = {
    id: '',
    streetName: '',
    houseNumber: '',
    plotArea: 0,
    user: {} as User
  }
  currentPage: number = 1;
  itemsPerPage: number = 10;
  isAdmin: boolean = false;
  filteredHouses: House[] = [];
  selectedStreet: string = '';
  searchedHouses: House[] = [];


  constructor(private router: Router, private apiService: ApiService, private cdr: ChangeDetectorRef, private userDetailService: UserDetailsService) {
    this.apiService.getAllHouses().subscribe((houses: House[]) => {
      this.houses = houses; // Update houses array when data changes
      this.filteredHouses = this.houses;
    });
    const userDetails = this.userDetailService.getUserDetails();
    if (userDetails) {
      if (userDetails.role === "ADMIN" || userDetails.role === "SUPERADMIN") {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    }

  }

  ngOnInit() {
    this.apiService.getAllHouses().subscribe((houses: House[]) => {
      this.houses = houses; // Update houses array when data changes
    });
  }

  public saveNewHouse(newHouseDetails: NgForm) {
    this.apiService.saveHouseInfo(newHouseDetails.value);
  }
  public deleteHouse(house: House) {
    this.apiService.deleteHouse(house.id);
  }
  public saveEditedHouse(houseDetails: NgForm) {
    this.apiService.updateHouseInfo(houseDetails.value);
  }

  closeModal(modalId: string): void {
    $('#' + modalId).modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endIndex(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.filteredHouses.length ? this.filteredHouses.length : end;
  }

  get totalRows(): number {
    return this.filteredHouses.length;
  }

  onItemsPerPageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(target.value, 10);
  }
  updatePage(page: number): void {
    this.currentPage = page;
  }
  getAllStreets(): Set<string> {
    const streets = new Set<string>();
    for (const house of this.houses) {
      if (!streets.has(house.streetName))
        streets.add(house.streetName)
    }
    return streets;
  }

  onStreetSelect(event: Event) {
    this.selectedStreet = (event.target as HTMLSelectElement).value;
  }

  searchHouses(): House[] {
    this.filteredHouses = this.houses;
    this.searchedHouses = [];
    if (this.selectedStreet === null || this.selectedStreet === '') {
      if (this.searchTerm === null || this.searchTerm === 'Search in all') {
        return this.filteredHouses = this.houses;
      } else {
        for (const house of this.houses) {
          if (house.user.firstName.includes(this.searchTerm) || house.user.lastName.includes(this.searchTerm)) {
            this.searchedHouses.push(house)
          }
        }
        return this.filteredHouses = this.searchedHouses;
      }
    } else {
      this.filteredHouses = this.houses.filter(house => house.streetName === this.selectedStreet)
      for (const house of this.filteredHouses) {
        if (house.user.firstName.includes(this.searchTerm) || house.user.lastName.includes(this.searchTerm)) {
          this.searchedHouses.push(house)
        }
      }
      return this.filteredHouses = this.searchedHouses;
    }
  }

}
