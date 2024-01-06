import { User } from "./User";

export interface House {
    [x: string]: any;
    id: any;
    houseNumber: string;
    streetName: string;
    plotArea: number;
    user: User;
}