import { User } from "./User";

export interface House {
    id: any;
    houseNumber: string;
    streetName: string;

    user: User;
}