import { User } from "./user";

export class Review {
    id: string;
    userID: string;
    productID: string;
    user: User;
    title: string;
    text: string;
    recommend: boolean;
    date: Date;
}
