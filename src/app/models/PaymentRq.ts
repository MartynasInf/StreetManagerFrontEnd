import { HousePayment } from "./HousePayment";

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