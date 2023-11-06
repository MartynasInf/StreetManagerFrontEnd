import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PaymentRq } from '../models/PaymentRq';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/API_service/api.service';
import { HousePayment } from '../models/HousePayment';
import { PaymentServiceService } from '../services/paymentRequest_service/payment-service.service';
import { PaymentRequestCreateFormComponent } from '../payment-request-create-form/payment-request-create-form.component';

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
  isRequestFullyPaid: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private paymentService: PaymentServiceService
  ) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.paymentRequestId = id ? +id : null; // Convert the string ID to a number or set to null if it's null

      // Fetch all payment requests from the API
      this.apiService.getAllPayments().subscribe((paymentRequestsFromDb: PaymentRq[]) => {
        this.paymentRequests = paymentRequestsFromDb;

        // Find the payment request after both ID and payment requests data are available
        this.paymentRequest = this.getPaymentRequest();


        this.checkIfRequestIsFullyPaid(this.paymentRequest);
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

  payHousePayment(housePaymentId: any) {
    this.housePayment.id = housePaymentId;
    this.apiService.payHousePayment(this.housePayment);
    this.checkIfRequestIsFullyPaid(this.paymentRequest)
  }


  archivePaymentRequest(requestId: any) {
    this.newPaymentRequest.id = requestId;
    this.newPaymentRequest.operationStatus = "ARCHIVED";
    this.apiService.changePaymentRequestOperationStatus(this.newPaymentRequest);
  }

  checkIfRequestIsFullyPaid(paymentRequest: PaymentRq): boolean {
    this.isRequestFullyPaid = true;
    for (let housePayment of paymentRequest.housePayments) {
      if (!housePayment.isPaid) {
        this.isRequestFullyPaid = false;
        break;
      }
    }
    return this.isRequestFullyPaid;
  }

  editPaymentRequest(id: number){
    this.router.navigate(['/dashboard/paymentOperationCreateForm/edit', id]);
  }


}
