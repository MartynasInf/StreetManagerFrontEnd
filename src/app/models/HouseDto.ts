import { UserDto } from "./userDto";


export interface HouseDto {
    id: any;
    houseNumber: string;
    streetName: string;

    user: UserDto;
}