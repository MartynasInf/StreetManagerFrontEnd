import { Injectable } from '@angular/core';
import { HousePayment } from '../models/HousePayment';

@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {

  constructor() { }

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
}
