import { HouseDto } from "./HouseDto";

export interface HousePayment {
    id: any;
    amount: number;
    isPaid: boolean;

    house: HouseDto;
}