import { SubCategory } from './categories'
import { ItemClassification } from './item-classification'

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
}
