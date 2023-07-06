import { loggedInUserDetails } from "./loggedInUserDetails";

export interface AuthResponse {
    token: string;
    user: loggedInUserDetails;
}