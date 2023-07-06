import { House } from "./House";


export interface User {
    id: any;
    firstName: string;
    lastName: string
    email: string;
    password: string;
    phoneNumber: string;
    bankAccount: string;
    enabled: boolean;
    house: House;
}