import { Product } from "./product";
import { User } from "./user";

export class Review {
    userID: string;
    productID: string;
    user: User;
    product: Product;
    title: string;
    text: string;
    date: number;
}
