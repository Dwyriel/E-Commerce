export class Rating {
    id: string;
    ratedUserId: string;
    raterUserId: string;
    linkedPurchaseId: string;
    recommend: boolean;
    date: Date;
}
