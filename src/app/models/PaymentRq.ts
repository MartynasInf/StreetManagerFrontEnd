import { HousePayment } from "./HousePayment";
import { UserDto } from "./userDto";

export interface PaymentRq {
    id: any;
    purpose: string;
    dueDate: Date;
    totalSum: number;
    operationStatus: string;
    housePayments: HousePayment[];
    creator: string;
    creationDate: Date;


    houseIds: number[];
}