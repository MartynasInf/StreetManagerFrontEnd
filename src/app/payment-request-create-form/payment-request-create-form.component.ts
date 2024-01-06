import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { PaymentRq } from '../models/PaymentRq';
import { House } from '../models/House';
import { ApiService } from '../services/API_service/api.service';
import { NgForm } from '@angular/forms';
import { HousePayment } from '../models/HousePayment';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDetailsService } from '../services/user_service/user-details.service';
import { combineLatest } from 'rxjs';


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
  isEditing: boolean = false;
  paymentRqForEdit: PaymentRq = {} as PaymentRq;
  housesFromPaymentRq: House[] = [];


  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef, private router: Router, private userDetails: UserDetailsService, private route: ActivatedRoute, private ngZone: NgZone) {
    combineLatest([
      this.apiService.getAllHouses(),
      this.apiService.getAllPayments()
    ]).subscribe(([houses, paymentRequestsFromDb]) => {
      this.houses = houses; // Update houses array when data changes
      this.filterHousesOnlyWithOwners();
      this.unselectedHouses = this.housesWithOwners;
      this.filteredUnselectedHouses = this.unselectedHouses;

      this.paymentRequests = paymentRequestsFromDb;
      const paymentRequestId = this.route.snapshot.params['id'];
      if (paymentRequestId) {
        this.isEditing = true;
        this.paymentRqForEdit = this.paymentRequests.find(pr => pr.id === +paymentRequestId)!;
        this.setPaymentRequestInfo(this.paymentRqForEdit);
      }
    });
  }

  public saveNewPaymentRequest(newRequest: NgForm) {
    if (this.isEditing) {
      // Handle the logic for updating an existing payment request
      // this.apiService.saveNewPaymentRequest(this.newPaymentRequestDto);
      const paymentRequestId = this.route.snapshot.params['id'];
      this.newPaymentRequestDto = newRequest.value;
      this.newPaymentRequestDto.id = paymentRequestId;
      this.newPaymentRequestDto.houseIds = this.generateHouseIds();
      const loggedInUserDetails = this.userDetails.getUserDetails();
      this.newPaymentRequestDto.creator = loggedInUserDetails.firstName + ' ' + loggedInUserDetails.lastName;
      this.apiService.saveNewPaymentRequest(this.newPaymentRequestDto)
      this.router.navigate(['/dashboard/paymentRequests'])
    } else {
      this.newPaymentRequestDto = newRequest.value;
      this.newPaymentRequestDto.houseIds = this.generateHouseIds();
      const loggedInUserDetails = this.userDetails.getUserDetails();
      this.newPaymentRequestDto.creator = loggedInUserDetails.firstName + ' ' + loggedInUserDetails.lastName;
      this.apiService.saveNewPaymentRequest(this.newPaymentRequestDto)
      this.router.navigate(['/dashboard/paymentRequests'])
    }
  }

  filterHousesOnlyWithOwners(): House[] {
    this.housesWithOwners = this.houses.filter((house) => house.user.id !== null && house.user.enabled === true);
    return this.housesWithOwners;
  }

  updateFilteredHouses() {
    this.filteredUnselectedHouses = this.unselectedHouses.filter(house => house.streetName.toLowerCase().includes(this.searchTermForSelecting.toLowerCase())
    );
  }

  updateSelectedHouses() {
    this.filterSelectedHouses = this.selectedHouses.filter(house => house.streetName.toLowerCase().includes(this.searchTermForSelected.toLowerCase())
    );
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

  generateHouseIds(): number[] {
    const idsArray: number[] = this.selectedHouses.map(house => house.id);
    return idsArray;
  }

  regenerateHousesFromPaymentRequest(paymentRqForEdit: PaymentRq): House[] {
    this.housesFromPaymentRq = [];
    for (const housePayment of paymentRqForEdit.housePayments) {
      if (housePayment.house && housePayment.house.id !== undefined) {
        console.log('lets see if i retrieve all the houses')
        console.log(this.houses)
        let house = this.houses.find(houseToAdd => housePayment.house.id === houseToAdd.id);
        console.log('one house from payment request array')
        console.log(house)
        if (house) {
          this.housesFromPaymentRq.push(house);
          console.log('houses list for returning')
          console.log(this.housesFromPaymentRq)
        }
      }
    }
    return this.housesFromPaymentRq;
  }

  setPaymentRequestInfo(paymentRq: PaymentRq) {
    this.newPaymentRequest = paymentRq;
    this.filterSelectedHouses = this.regenerateHousesFromPaymentRequest(paymentRq);
    console.log('Filtered selected houses')
    console.log(this.filterSelectedHouses)
    this.filteredUnselectedHouses = this.filteredUnselectedHouses.filter(unselectedHouse =>
      !this.filterSelectedHouses.some(selectedHouse => selectedHouse.id === unselectedHouse.id)
    );
    this.unselectedHouses = this.filteredUnselectedHouses;
    this.selectedHouses = this.filterSelectedHouses;
  }
}