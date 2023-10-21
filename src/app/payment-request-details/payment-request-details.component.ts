import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PaymentRq } from '../models/PaymentRq';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { HousePayment } from '../models/HousePayment';

@Component({
  selector: 'app-payment-request-details',
  templateUrl: './payment-request-details.component.html',
  styleUrls: ['./payment-request-details.component.css']
})
export class PaymentRequestDetailsComponent implements OnInit {

  paymentRequests: PaymentRq[] = {} as PaymentRq[];
  paymentRequestId: number | null = null;
  paymentRequest: PaymentRq = {} as PaymentRq;
  newPaymentRequest: PaymentRq = {} as PaymentRq;
  housePayment: HousePayment = {} as HousePayment;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.paymentRequestId = id ? +id : null; // Convert the string ID to a number or set to null if it's null

      // Fetch all payment requests from the API
      this.apiService.getAllPayments().subscribe((paymentRequestsFromDb: PaymentRq[]) => {
        this.paymentRequests = paymentRequestsFromDb;

        // Find the payment request after both ID and payment requests data are available
        this.paymentRequest = this.getPaymentRequest();

        // Trigger change detection manually to update the view
        this.cdr.detectChanges();
      });
    });
  }

  ngOnInit() {
  }

  getPaymentRequest(): PaymentRq {
    const paymentRequest = this.paymentRequests.find(request => request.id === this.paymentRequestId);
    if (paymentRequest) {
      return paymentRequest;
    } else {
      return {
        id: -1,
        purpose: 'N/A',
        dueDate: new Date(1900, 1, 1),
        totalSum: 0,
        operationStatus: 'N/A',
        houseIds: [],
        creator: '',
        housePayments: [],
        creationDate: new Date(1900, 1, 1)
      }
    }
  }

  deletePaymentRequest(requestId: number) {
    this.router.navigate(['/dashboard/paymentRequests']);
    this.apiService.deletePaymentRequest(requestId)

  }

  submitPaymentRequest(requestId: number) {
    this.newPaymentRequest.id = requestId;
    this.newPaymentRequest.operationStatus = "ACTIVATED";
    this.apiService.changePaymentRequestOperationStatus(this.newPaymentRequest);
  }

  // public percentageCalculator(housePayments: HousePayment[]): number {
  //   let paidCount = 0;
  //   let unpaidCount = 0;

  //   for (const housePayment of housePayments) {
  //     if (housePayment.isPaid) {
  //       paidCount++;
  //     } else {
  //       unpaidCount++;
  //     }
  //   }
  //   let sumOfPayments = paidCount + unpaidCount;
  //   let paymentPercents = Math.round(paidCount / sumOfPayments * 100);
  //   return paymentPercents;
  // }

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
