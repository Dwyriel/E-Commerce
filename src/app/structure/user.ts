export class User {
    id: string;
    name: string;
    password: string;
    email: string;
    tel: string;
    address: string;
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