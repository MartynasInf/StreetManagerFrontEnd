import { ChangeDetectorRef, Component } from '@angular/core';
import { PaymentRq } from '../models/PaymentRq';
import { House } from '../models/House';
import { ApiService } from '../services/api.service';
import { NgForm } from '@angular/forms';
import { HousePayment } from '../models/HousePayment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-payment-request-create-form',
  templateUrl: './payment-request-create-form.component.html',
  styleUrls: ['./payment-request-create-form.component.css']
})
export class PaymentRequestCreateFormComponent {
  selectedValues: string[] = [];
  paymentRequests: PaymentRq[] = [];
  newPaymentRequest: PaymentRq = {} as PaymentRq;
  houses: House[] = [];
  housePayment: HousePayment = {} as HousePayment;
  housesWithOwners: House[] = [];
  searchTermForSelecting: string = '';
  searchTermForSelected: string = '';

  newPaymentRequestDto: PaymentRq = {} as PaymentRq;

  unselectedHouses: House[] = [];
  selectedHouses: House[] = [];

  filterSelectedHouses: House[] = [];
  filteredUnselectedHouses: House[] = [];

  pageForUnselectedHouses: number = 1;
  pageForSelectedHouses: number = 1;





  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef, private router: Router) {
    this.apiService.getAllPayments().subscribe((paymentRequestsFromDb: PaymentRq[]) => {
      this.paymentRequests = paymentRequestsFromDb; // Update houses array when data changes
    });
    this.apiService.getAllHouses().subscribe((houses: House[]) => {
      this.houses = houses; // Update houses array when data changes
      this.filterHousesOnlyWithOwners();
      this.unselectedHouses = this.housesWithOwners;
      this.filteredUnselectedHouses = this.unselectedHouses;

 
    });
  }

  public saveNewPaymentRequest(newRequest: NgForm) {
    this.newPaymentRequestDto = newRequest.value;
    this.newPaymentRequestDto.houseIds = this.generateHouseIds();
    this.apiService.saveNewPaymentRequest(this.newPaymentRequestDto)
    this.router.navigate(['/dashboard/paymentRequests'])
  }

  public filterHousesOnlyWithOwners(): House[] {
    this.housesWithOwners = this.houses.filter((house) => house.user.id !== null && house.user.enabled === true);
    return this.housesWithOwners;
  }

  updateFilteredHouses() {
    this.filteredUnselectedHouses = this.unselectedHouses.filter(house => house.streetName.toLowerCase().includes(this.searchTermForSelecting.toLowerCase())
    );
    console.log('filtered unselected houses' + this.filteredUnselectedHouses.length)
  }

  updateSelectedHouses() {
    this.filterSelectedHouses = this.selectedHouses.filter(house => house.streetName.toLowerCase().includes(this.searchTermForSelected.toLowerCase())
    );
    console.log('filtered selected houses' + this.filterSelectedHouses.length)
  }

  selectHouse(house: House) {
    this.selectedHouses.push(house);
    const index = this.unselectedHouses.findIndex(obj => obj.id === house.id);
    if (index !== -1) {
      this.unselectedHouses.splice(index, 1);
    }
    this.updateFilteredHouses();
    this.updateSelectedHouses();

  }

  removeFromSelected(house: House) {
    this.unselectedHouses.push(house);
    const index = this.selectedHouses.findIndex(obj => obj.id === house.id);
    if (index !== -1) {
      this.selectedHouses.splice(index, 1);
    }
    this.updateSelectedHouses();
    this.updateFilteredHouses();
    
  }

  private generateHouseIds(): number[] {
    const idsArray: number[] = this.selectedHouses.map(house => house.id);
    return idsArray;
  }
}