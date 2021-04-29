import { SubCategory } from './categories'
import { ItemClassification } from './item-classification'
import { Review } from './review';

export class Product {
    id: string;
    sellerID: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    gallery: string[] = [];
    subCatValue: number;
    subCategory: SubCategory;
    avgReview: number;
    reviews: Review[];
    verified: boolean = false;

    /**
     * Uses the attribute subCatValue to retrieve and fill the attribute subCategory.
     */
    public fillSubCategory() {
        if (!this.subCatValue) {
            console.error('fillSubCategory called on a object with subCatValue null or undefined');
            return;
        }
        if (!ItemClassification.SubCatsContains(this.subCatValue)) {
            console.error('the value of subCatValue does not represent a subcategory');
            return;
        }
        this.subCategory = ItemClassification.GetSubCatFromValue(this.subCatValue);
    }

    /**
     * Calculates and attributes the percentage of good/bad reviews to avgReview.
     */
    public calculateAvgRating() {
        if (!this.reviews || this.reviews.length < 1) {
            this.avgReview = null;
            return;
        }
        const totalRatings: number = this.reviews.length;
        var positiveRatings: number = 0;
        this.reviews.forEach(rating => {
            positiveRatings = (rating.recommend) ? ++positiveRatings : positiveRatings;
        });
        this.avgReview = (positiveRatings / totalRatings) * 100;
    }
}
