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
    cart: { productID: string, amount: number }[] = [];
}

export enum UserType {
    Admin,
    User
}