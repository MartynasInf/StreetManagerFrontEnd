import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from '../API_service/api.service';
import { UserDetailsService } from '../user_service/user-details.service';
import { House } from 'src/app/models/House';
import { User } from 'src/app/models/User';
import { PaymentRq } from 'src/app/models/PaymentRq';

@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {

  houses: House[] = [];
  users: User[] = [];
  paymentRequests: PaymentRq[] = [];
  paymentRequest: PaymentRq = {} as PaymentRq;

  constructor(private apiServices: ApiService, private userDetailService: UserDetailsService) {
    this.apiServices.getAllHouses().subscribe((houses: House[]) => {
      this.houses = houses; // Update houses array when data changes
      // this.filterHousesWithNoOwner();
    });
    this.apiServices.getAllUsers().subscribe((users: User[]) => {
      this.users = users; // Update houses array when data changes
      // this.filteredUsers = this.users;
    });
    this.apiServices.getAllPayments().subscribe((paymentRequestsFromDb: PaymentRq[]) => {
      this.paymentRequests = paymentRequestsFromDb; // Update houses array when data changes
      // this.sortPaymentRequestsByActivity(this.paymentRequests)
    });
  }
  getPaymentRequestById(id: number): Observable<PaymentRq | undefined> {
    // Use the 'of' function to return an observable
    const paymentRequest = this.paymentRequests.find((request) => request.id === id);
    return of(paymentRequest);
  }



}
