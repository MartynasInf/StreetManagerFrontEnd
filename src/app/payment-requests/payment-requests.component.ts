import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { PaymentRq } from '../models/PaymentRq';
import { NgForm } from '@angular/forms';
import { House } from '../models/House';
import { HousePayment } from '../models/HousePayment';
import { PercentPipe } from '@angular/common';
import { Router } from '@angular/router';


declare var $: any;

@Component({
  selector: 'app-payment-requests',
  templateUrl: './payment-requests.component.html',
  styleUrls: ['./payment-requests.component.css']
})
export class PaymentRequestsComponent {
  selectedValues: string[] = [];
  paymentRequests: PaymentRq[] = [];
  newPaymentRequest: PaymentRq = {} as PaymentRq;
  houses: House[] = [];
  housePayment: HousePayment = {} as HousePayment;
  housesWithOwners: House[] = [];
  activePaymentRequests: PaymentRq[] = [];
  archivedPaymentRequests: PaymentRq[] = [];


  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef, private router: Router) {
    this.apiService.getAllPayments().subscribe((paymentRequestsFromDb: PaymentRq[]) => {
      this.paymentRequests = paymentRequestsFromDb; // Update houses array when data changes
      this.sortPaymentRequestsByActivity(this.paymentRequests)
    });
    this.apiService.getAllHouses().subscribe((houses: House[]) => {
      this.houses = houses; // Update houses array when data changes
    });
  }

  ngOnInit() {
    // this.apiService.getAllPayments().subscribe((paymentRequestsFromDb: PaymentRq[]) => {
    //   this.paymentRequests = paymentRequestsFromDb; // Update houses array when data changes
    // });
  }

  sortPaymentRequestsByActivity(retrivedRequests: PaymentRq[]) {
    this.archivedPaymentRequests = [];
    this.activePaymentRequests = [];
    for (const paymentRq of retrivedRequests) {
      if (paymentRq.operationStatus === "ARCHIVED") {
        this.archivedPaymentRequests.push(paymentRq);
      } else {
        this.activePaymentRequests.push(paymentRq)
      }
    }
  }

  percentageCalculator(housePayments: HousePayment[]): number {
    let paidCount = 0;
    let unpaidCount = 0;

    for (const housePayment of housePayments) {
      if (housePayment.isPaid) {
        paidCount++;
      } else {
        unpaidCount++;
      }
    }
    let sumOfPayments = paidCount + unpaidCount;
    let paymentPercents = Math.round(paidCount / sumOfPayments * 100);
    return paymentPercents;
  }
  openPaymentRequestDetails(id: number) {
    this.router.navigate(['/dashboard/paymentRequestDetails', id]);
  }

}
