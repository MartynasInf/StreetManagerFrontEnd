import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UserDto } from '../../models/userDto';
import { User } from '../../models/User';
import { House } from '../../models/House';
import { loggedInUserDetails } from '../../models/loggedInUserDetails';
import { UserDetailsService } from '../user_service/user-details.service';
import { PaymentRq } from '../../models/PaymentRq';
import { HousePayment } from '../../models/HousePayment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient, private userInfoService: UserDetailsService) { }

  private users: User[] = [];
  private houses: House[] = [];
  private paymentRequests: PaymentRq[] = [];
  private user: loggedInUserDetails = {} as loggedInUserDetails;
  private userUpdated = new Subject<User[]>();
  private housesUpdated = new Subject<House[]>();
  private paymentRequestsUpdated = new Subject<PaymentRq[]>();

  //-------------------------------------------------------------------------------------
  public saveUsersInfo(userDetails: UserDto): void {
    this.saveUserToDb(userDetails).subscribe(
      (response: UserDto) => {
        console.log(response);
        this.getAllHouses();
        this.getAllUsers();
      }
    )
  }

  private saveUserToDb(userDetails: UserDto): Observable<UserDto> {
    const headers = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("myToken"));
    return this.httpClient.post<UserDto>("http://localhost:8080/authorised/users/", userDetails, { headers, responseType: 'text' as 'json' })
  }
  //---------------------------------------------------------------------------------------
  public getAllUsers(): Observable<User[]> {
    this.getAllUsersFromDB().subscribe(
      (response: User[]) => {
        this.users = response;
        this.userUpdated.next([...this.users]);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
    return this.userUpdated.asObservable();
  }

  private getAllUsersFromDB(): Observable<User[]> {
    const headers = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("myToken"));
    return this.httpClient.get<User[]>('http://localhost:8080/authorised/users/', { headers })
  }
  //------------------------------------------------------------------------------------------
  public getAllHouses(): Observable<House[]> {
    this.getAllHousesFromDB().subscribe(
      (response: House[]) => {
        this.houses = response;
        this.housesUpdated.next([...this.houses]);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
    return this.housesUpdated.asObservable();
  }

  private getAllHousesFromDB(): Observable<House[]> {
    const headers = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("myToken"));
    return this.httpClient.get<House[]>('http://localhost:8080/authorised/houses/', { headers })
  }
  //-------------------------------------------------------------------------------------------
  public saveNewUser(userDetails: UserDto): void {
    this.saveNewUserToDb(userDetails).subscribe(
      (response: UserDto) => {
        this.getAllHouses();
        this.getAllUsers();
        this.getAllPayments();
      }
    )
  }

  private saveNewUserToDb(userDetails: UserDto): Observable<UserDto> {
    const headers = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("myToken"));
    return this.httpClient.post<UserDto>("http://localhost:8080/authorised/users/admin/register", userDetails, { headers, responseType: 'text' as 'json' })
  }
  //-------------------------------------------------------------------------------------------
  public saveHouseInfo(houseInfo: House): void {
    this.saveHouseToDB(houseInfo).subscribe(
      (response: House) => {
        this.getAllHouses();
        this.getAllUsers();
        this.getAllPayments();
      }
    )
  }

  private saveHouseToDB(houseInfo: House): Observable<House> {
    const headers = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("myToken"));
    return this.httpClient.post<House>("http://localhost:8080/authorised/houses/admin/add", houseInfo, { headers, responseType: 'text' as 'json' })
  }
  //-----------------------------------------------------------------------------------------
  public updateHouseInfo(houseInfo: House): void {
    this.saveUpdatedHouseToDB(houseInfo).subscribe(
      (response: House) => {
        this.getAllHouses();
        this.getAllUsers();
        this.getAllPayments();
      }
    )
  }

  private saveUpdatedHouseToDB(houseInfo: House): Observable<House> {
    const headers = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("myToken"));
    return this.httpClient.post<House>("http://localhost:8080/authorised/houses/admin/update", houseInfo, { headers, responseType: 'text' as 'json' })
  }

  //-----------------------------------------------------------------------------------------
  public deleteHouse(houseId: any) {
    this.deleteHouseFromDB(houseId).subscribe(
      (response: House) => {
        this.getAllHouses();
        this.getAllUsers();
        this.getAllPayments();
      }
    )
  }

  private deleteHouseFromDB(houseId: any) {
    const headers = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("myToken"));
    return this.httpClient.delete<House>('http://localhost:8080/authorised/houses/admin/delete/' + houseId, { headers, responseType: 'text' as 'json' })
  }
  //-----------------------------------------------------------------------------------------
  public deleteUser(userId: any) {
    this.deleteUserFromDB(userId).subscribe(
      (response: User) => {
        this.getAllHouses();
        this.getAllUsers();
        this.getAllPayments();
      }
    )
  }

  private deleteUserFromDB(userId: any): Observable<User> {
    const headers = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("myToken"));
    return this.httpClient.delete<User>('http://localhost:8080/authorised/users/admin/delete/' + userId, { headers, responseType: 'text' as 'json' })
  }
  //-------------------------------------------------------------------------------------------
  public getAllPayments(): Observable<PaymentRq[]> {
    this.getAllPaymentsFromDB().subscribe(
      (response: PaymentRq[]) => {
        this.paymentRequests = response;
        this.paymentRequestsUpdated.next([...this.paymentRequests]);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
    return this.paymentRequestsUpdated.asObservable();
  }

  private getAllPaymentsFromDB(): Observable<PaymentRq[]> {
    const headers = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("myToken"));
    return this.httpClient.get<PaymentRq[]>('http://localhost:8080/authorised/payments/', { headers })
  }
  //----------------------------------------------------------------------------------------------------
  public saveNewPaymentRequest(paymentRequest: PaymentRq): void {
    this.saveNewPaymentToDb(paymentRequest).subscribe(
      (response: PaymentRq) => {
        this.getAllHouses();
        this.getAllUsers();
        this.getAllPayments();
      }
    )
  }

  private saveNewPaymentToDb(paymentRequest: PaymentRq): Observable<PaymentRq> {
    const headers = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("myToken"));
    return this.httpClient.post<PaymentRq>("http://localhost:8080/authorised/payments/newPaymentRequest", paymentRequest, { headers, responseType: 'text' as 'json' })
  }
  //-----------------------------------------------------------------------------------------------------
  public deletePaymentRequest(paymentId: any) {
    this.deletePaymentRequestFromDb(paymentId).subscribe(
      (response: PaymentRq) => {
        this.getAllHouses();
        this.getAllUsers();
        this.getAllPayments();
      }
    )
  }

  private deletePaymentRequestFromDb(paymentId: any): Observable<PaymentRq> {
    const headers = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("myToken"));
    return this.httpClient.delete<PaymentRq>('http://localhost:8080/authorised/payments/deletePaymentRequest/' + paymentId, { headers, responseType: 'text' as 'json' })
  }
  //------------------------------------------------------------------------------------------------------
  public changePaymentRequestOperationStatus(paymentRequest: PaymentRq) {
    this.changePaymentRequestOperationStatusInDb(paymentRequest).subscribe(
      (response: PaymentRq) => {
        this.getAllHouses();
        this.getAllUsers();
        this.getAllPayments();
      }
    )
  }

  private changePaymentRequestOperationStatusInDb(paymentRequest: PaymentRq): Observable<PaymentRq> {
    const headers = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("myToken"));
    return this.httpClient.post<PaymentRq>('http://localhost:8080/authorised/payments/changePaymentRequestStatus', paymentRequest, { headers, responseType: 'text' as 'json' })
  }
  //------------------------------------------------------------------------------------------------------------
  public payHousePayment(housePayment: HousePayment) {
    this.changeHousePaymentStatusInDb(housePayment).subscribe(
      (response: HousePayment) => {
        this.getAllHouses();
        this.getAllUsers();
        this.getAllPayments();
      }
    )
  }

  private changeHousePaymentStatusInDb(housePayment: HousePayment): Observable<HousePayment> {
    const headers = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("myToken"));
    return this.httpClient.post<HousePayment>('http://localhost:8080/authorised/housePayments/pay', housePayment, { headers, responseType: 'text' as 'json' })
  }
}
