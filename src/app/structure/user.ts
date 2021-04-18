import { Address } from "node:cluster";

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