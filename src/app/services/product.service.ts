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
  Add(product: Product) {
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
  GetAll() {
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
  Get(id: string) {
    return this.fireDatabase.collection(this.collection).doc<Product>(id).valueChanges();
  }

  /**
   * Update the informantion of a product.
   * @param product the object with the updated information.
   * @param id the id of the product that will be changed.
   */
  Update(product: Product, id: string) {
    return this.fireDatabase.collection(this.collection).doc(id).update(product);
  }

  /**
   * Deletes the product from the database.
   * @param id the id of the product that will be deleted.
   */
  Delete(id: string) {
    return this.fireDatabase.collection(this.collection).doc(id).delete();
  }
}
