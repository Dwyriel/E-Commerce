import { Address } from "./address";
import { Rating } from "./rating";

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
    ratings: Rating[];
    cart: { productID: string, amount: number }[] = [];
    viewList: any[] = [];

    /**
     * Calculates and attributes the percentage of good/bad ratings to avgRating.
     */
    calculateAvgRating() {
        if (!this.ratings || this.ratings.length < 1) {
            this.avgRating = null;
            return;
        }
        const totalRatings: number = this.ratings.length;
        var positiveRatings: number = 0;
        this.ratings.forEach(rating => {
            positiveRatings = (rating.recommend) ? ++positiveRatings : positiveRatings;
        });
        this.avgRating = (positiveRatings / totalRatings) * 100;
    }
}

export enum UserType {
    Admin,
    User
}

export function GetViewListInOrder(viewList: any[]) {
    var tempIndex = viewList[0];
    var arrayLength = viewList.length;
    var tempIndexes: Array<any> = [];
    var tempArray: Array<string> = [];
    for (let i = tempIndex; i > 0; i--) {
        tempIndexes.push(i);
    }
    for (let i = arrayLength - 1; i > tempIndex; i--) {
        tempIndexes.push(i)
    }
    for (let index of tempIndexes) {
        tempArray.push(viewList[index]);
    }
    return tempArray;
}