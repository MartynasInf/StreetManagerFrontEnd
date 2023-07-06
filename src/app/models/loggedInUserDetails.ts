import { House } from "./House";

export interface loggedInUserDetails {
    id: any;
    firstName: string;
    lastName: string
    email: string;
    house: House;
    role: string;
    password: string;
    phoneNumber: string;
    bankAccount: string;
    enabled:boolean;
    
}