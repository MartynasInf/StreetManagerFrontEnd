import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { PaymentRq } from '../models/PaymentRq';
import { NgForm } from '@angular/forms';
import { House } from '../models/House';
import { HousePayment } from '../models/HousePayment';
import { PercentPipe } from '@angular/common';


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


  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef){
    this.apiService.getAllPayments().subscribe((paymentRequestsFromDb: PaymentRq[]) => {
      this.paymentRequests = paymentRequestsFromDb; // Update houses array when data changes
    });
    this.apiService.getAllHouses().subscribe((houses: House[]) => {
      this.houses = houses; // Update houses array when data changes
    });
  }

  ngOnInit(){
    this.apiService.getAllPayments().subscribe((paymentRequestsFromDb: PaymentRq[]) => {
      this.paymentRequests = paymentRequestsFromDb; // Update houses array when data changes
    });
    // this.apiService.getAllHouses().subscribe((houses: House[]) => {
    //   this.houses = houses; // Update houses array when data changes
    // });
  }



  public deletePaymentRequest(requestId: any){
    this.apiService.deletePaymentRequest(requestId)
  }

  public submitPaymentRequest(requestId: any){
    this.newPaymentRequest.id = requestId;
    this.newPaymentRequest.operationStatus = "ACTIVE";
    this.apiService.changePaymentRequestOperationStatus(this.newPaymentRequest);
  }

  public percentageCalculator(housePayments: HousePayment[]): number{
    let paidCount = 0;
    let unpaidCount = 0;

    for(const housePayment of housePayments){
      if(housePayment.isPaid){
        paidCount++;
      } else {
        unpaidCount++;
      }
    }
    let sumOfPayments = paidCount + unpaidCount;
    let paymentPercents = Math.round(paidCount/sumOfPayments * 100);
    return paymentPercents;
  }

  public payHousePayment(housePaymentId: any){
    this.housePayment.id = housePaymentId;
    this.apiService.payHousePayment(this.housePayment);
  }

  public archivePaymentRequest(requestId: any){
    this.newPaymentRequest.id = requestId;
    this.newPaymentRequest.operationStatus = "ARCHIVED";
    this.apiService.changePaymentRequestOperationStatus(this.newPaymentRequest);
  }

}
