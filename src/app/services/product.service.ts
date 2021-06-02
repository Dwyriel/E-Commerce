import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from '../structure/product';
import { map } from 'rxjs/operators';
import { SubCategory } from '../structure/categories';
import { ItemClassification } from '../structure/item-classification';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private collection: string = "Products";

  constructor(private fireDatabase: AngularFirestore) { }

  /**
   * Creates a new product entry on the database.
   * @param product the product that will be saved on the database.
   */
  async Add(product: Product) {
    return this.fireDatabase.collection(this.collection).add({
      sellerID: product.sellerID,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      gallery: product.gallery,
      subCatValue: product.subCatValue,
      searchArray: product.name.toLowerCase().split(" "),
      verified: false,
      deleted: false,
    })
  }

  /**
   * Retrieves all the products from the database.
   */
  async GetAll() {
    return this.fireDatabase.collection<Product>(this.collection, ref => ref.where('deleted', '==', false)).snapshotChanges()
      .pipe(
        map(
          dados => dados.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data(), fillSubCategory: new Product().fillSubCategory, calculateAvgRating: new Product().calculateAvgRating }))
        )
      )
  }

  /**
   * Retrieves all the products from the database.
   */
  async GetAllNoRestriction() {
    return this.fireDatabase.collection<Product>(this.collection).snapshotChanges()
      .pipe(
        map(
          dados => dados.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data(), fillSubCategory: new Product().fillSubCategory, calculateAvgRating: new Product().calculateAvgRating }))
        )
      )
  }

  /**
   * Retrieves all verified products from the database.
   */
  async GetAllVerified() {
    return this.fireDatabase.collection<Product>(this.collection, ref => ref.where('verified', '==', true).where('deleted', '==', false)).snapshotChanges()
      .pipe(
        map(
          dados => dados.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data(), fillSubCategory: new Product().fillSubCategory, calculateAvgRating: new Product().calculateAvgRating }))
        )
      )
  }

  /**
   * Retrieves all the products based on a search string.
   * @param search the string used for the search, should be a single word with no upper case letter.
   * @returns a subscription for an array that contains the products that were found by the search.
   */
  async GetBySearch(search: string) {
    return this.fireDatabase.collection<Product>(this.collection, ref =>
      ref.where("searchArray", "array-contains", search).where('verified', '==', true).where('deleted', '==', false)
    ).snapshotChanges().pipe(map(ans => ans.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data(), fillSubCategory: new Product().fillSubCategory, calculateAvgRating: new Product().calculateAvgRating }))));
  }

  /**
   * Retrieves all the products based on a search string.
   * @param search the string used for the search.
   * @returns a subscription for an array that contains the products that were found by the search.
   */
  async getBySearchFullString(search: string) {
    var shouldWait: boolean = true;
    var subscriptions: Subscription[] = [];
    var index = 0;
    var products: Product[] = [];
    var searchArray: string[] = search.toLowerCase().split(" ");
    var arrayLength = searchArray.length;
    for (var item of searchArray) {
      subscriptions.push((await this.GetBySearch(item)).subscribe(ans => {
        if (ans)
          products.push(...ans);
        index++;
        if (index >= arrayLength)
          shouldWait = false;
      }));
    }
    while (shouldWait)
      await new Promise(resolve => setTimeout(resolve, 10));
    for (var sub of subscriptions)
      sub.unsubscribe();
    products = products.filter((product, index, array) => index === array.findIndex(prod => (prod.id === product.id)));
    return products;
  }

  /**
   * Retrieves all the products from a specific seller.
   * @param id the user id of the seller.
   * @returns a subscription for an array that contains all the seller's adverts.
   */
  async GetAllFromSeller(id: string) {
    return this.fireDatabase.collection<Product>(this.collection, ref => ref.where('sellerID', '==', id).where('deleted', '==', false)).snapshotChanges().pipe(map(
      ans => ans.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data(), fillSubCategory: new Product().fillSubCategory, calculateAvgRating: new Product().calculateAvgRating }))
    ));
  }

  /**
   * Retrieves the products within the corresponding subcategory.
   * @param value the subcategory value to get the products from.
   * @returns an Array with all the products within a subcategory.
   */
  async GetAllFromSubCat(value: number) {
    return this.fireDatabase.collection<Product>(this.collection, ref => ref.where('subCatValue', '==', value).where('deleted', '==', false)).snapshotChanges().pipe(map(
      ans => ans.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data(), fillSubCategory: new Product().fillSubCategory, calculateAvgRating: new Product().calculateAvgRating }))
    ));
  }

  /**
   * Retrieves all verified products within the corresponding subcategory.
   * @param value the subcategory value to get the products from.
   * @returns an Array with all the verified products within a subcategory.
   */
  async GetAllVerifiedFromSubCat(value: number) {
    return this.fireDatabase.collection<Product>(this.collection, ref => ref.where('subCatValue', '==', value).where('verified', '==', true).where('deleted', '==', false)).snapshotChanges().pipe(map(
      ans => ans.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data(), fillSubCategory: new Product().fillSubCategory, calculateAvgRating: new Product().calculateAvgRating }))
    ));
  }

  /**
   * Retrieves the products within the corresponding category.
   * @param value the general category to get the products from.
   * @returns an Array with all the products within a category.
   */
  async getAllFromCat(value: number) {
    var shouldWait: boolean = true;
    var subscriptions: Subscription[] = [];
    var index = 0;
    var products: Product[] = [];
    var subcats: SubCategory[] = ItemClassification.GetSubCatFrom(value);
    var arrayLength = subcats.length;
    for (var item of subcats) {
      subscriptions.push((await this.GetAllFromSubCat(item.value)).subscribe(ans => {
        if (ans)
          products.push(...ans);
        index++;
        if (index >= arrayLength)
          shouldWait = false;
      }));
    }
    while (shouldWait)
      await new Promise(resolve => setTimeout(resolve, 10));
    for (var sub of subscriptions)
      sub.unsubscribe();
    products = products.filter((product, index, array) => index === array.findIndex(prod => (prod.id === product.id)));
    return products;
  }

  /**
   * Retrieves the verified products within the corresponding category.
   * @param value the general category to get the products from.
   * @returns an Array with all the verified products within a category.
   */
  async getAllVerifiedFromCat(value: number) {
    var shouldWait: boolean = true;
    var subscriptions: Subscription[] = [];
    var index = 0;
    var products: Product[] = [];
    var subcats: SubCategory[] = ItemClassification.GetSubCatFrom(value);
    var arrayLength = subcats.length;
    for (var item of subcats) {
      subscriptions.push((await this.GetAllVerifiedFromSubCat(item.value)).subscribe(ans => {
        if (ans)
          products.push(...ans);
        index++;
        if (index >= arrayLength)
          shouldWait = false;
      }));
    }
    while (shouldWait)
      await new Promise(resolve => setTimeout(resolve, 10));
    for (var sub of subscriptions)
      sub.unsubscribe();
    products = products.filter((product, index, array) => index === array.findIndex(prod => (prod.id === product.id)));
    return products;
  }

  /**
   * Retrieves the product with the corresponding id.
   * @param id the id of the product.
   */
  async Get(id: string) {
    return this.fireDatabase.collection(this.collection, ref => ref.where('deleted', '==', false)).doc<Product>(id).valueChanges();
  }

  /**
   * Retrieves the product with the corresponding id.
   * @param id the id of the product.
   */
  async GetNoRestriction(id: string) {
    return this.fireDatabase.collection(this.collection).doc<Product>(id).valueChanges();
  }

  /**
   * Update the informantion of a product.
   * @param product the object with the updated information.
   * @param id the id of the product that will be changed.
   */
  async Update(product: Product, id: string) {
    return this.fireDatabase.collection(this.collection).doc(id).update({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      gallery: product.gallery,
      subCatValue: product.subCatValue,
      searchArray: product.name.toLowerCase().split(" "),
    });
  }

  /** Changes the verified attribute on the specified product.
   * @param id the product's id.
   * @param verified the new verified value that will be attributed to the product.
   */
  async UpdateVerified(id: string, verified: boolean) {
    return await this.fireDatabase.collection(this.collection).doc(id).update({ verified: verified });
  }

  /** Changes the stock attribute on the specified product.
   * @param id the product's id.
   * @param stock the new stock value that will be attributed to the product.
   */
  async UpdateStock(id: string, stock: number) {
    return await this.fireDatabase.collection(this.collection).doc(id).update({ stock: stock });
  }

  /** Changes the deleted attribute on the specified product.
   * @param id the product's id.
   * @param deleted the new deleted value that will be attributed to the product.
   */
  async DeleteCallFromUser(id: string, deleted: boolean) {
    return await this.fireDatabase.collection(this.collection).doc(id).update({ deleted: deleted });
  }

  /**
   * Deletes the product from the database.
   * @param id the id of the product that will be deleted.
   */
  async Delete(id: string) {
    return this.fireDatabase.collection(this.collection).doc(id).delete();
  }
}
