import { Address } from "./address";

export class User {
    id: string;
    name: string;
    password: string;
    email: string;
    tel: string;
    addressId: string;
    address: Address
    photo: string;
    userType: UserType;
    active: boolean = true;
    avgRating: number;
    ratings: number[];
    cart: { productID: string, amount: number }[] = [];
}

export enum UserType {
    Admin,
    User
}