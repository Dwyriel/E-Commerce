import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from '../structure/product';
import { map } from 'rxjs/operators';

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
      verified: false,
    })
  }

  /**
   * Retrieves all the products from the database.
   */
  async GetAll() {
    return this.fireDatabase.collection<Product>(this.collection).snapshotChanges()
      .pipe(
        map(
          dados => dados.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data() }))
        )
      )
  }

  /**
   * Retrieves the product with the corresponding id.
   * @param id the id of the product.
   */
  async Get(id: string) {
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
    });
  }

  /** Changes the verified attribute on the specified product.
   * @param id the product's id.
   * @param verified the new verified value that will be attributed to the product.
   */
  async UpdateVerified(id: string, verified: boolean) {
    return await this.fireDatabase.collection(this.collection).doc(id).update({ verified: verified });
  }

  /**
   * Deletes the product from the database.
   * @param id the id of the product that will be deleted.
   */
  async Delete(id: string) {
    return this.fireDatabase.collection(this.collection).doc(id).delete();
  }
}
