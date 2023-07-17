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


  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef, private router: Router) {
    this.apiService.getAllPayments().subscribe((paymentRequestsFromDb: PaymentRq[]) => {
      this.paymentRequests = paymentRequestsFromDb; // Update houses array when data changes
    });
    this.apiService.getAllHouses().subscribe((houses: House[]) => {
      this.houses = houses; // Update houses array when data changes
      this.filterHousesOnlyWithOwners();
    });
  }

  public saveNewPaymentRequest(newRequest: NgForm) {
    this.apiService.saveNewPaymentRequest(newRequest.value)
    this.router.navigate(['/dashboard/paymentRequests'])
  }

  public filterHousesOnlyWithOwners(): House[] {
    this.housesWithOwners = this.houses.filter((house) => house.user.id !== null && house.user.enabled === true);
    console.log(this.houses);
    return this.housesWithOwners;
  }

}
