import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Purchases } from "../structure/purchases";

@Injectable({
  providedIn: 'root'
})
export class PurchasesService {
  private collection: string = "Purchases";

  constructor(private fireDatabase: AngularFirestore) { }

  /**
   * Creates a new purchase entry on the database.
   * @param purchases the object of type Purchases that will be saved on the database.
   */
  async Add(purchases: Purchases) {
    return await this.fireDatabase.collection(this.collection).add({
      userId: purchases.recommend,
      itens: [...purchases.itens],
      date: new Date().getTime(),
    });
  }

  /**
   * Retrieves the purchase with the specified id.
   * @param id the purchase's id.
   * @returns a observable containing an object with the purchase's data.
   */
  async Get(id: string) {
    return this.fireDatabase.collection(this.collection).doc<Purchases>(id).valueChanges();
  }

  /**
   * Retrieves all the purchases of an user.
   * @param id the id of the user.
   * @returns an observable containing all the user's purchases.
   */
  GetAllFromUser(id: string) {
    return this.fireDatabase.collection<Purchases>(this.collection, ref => ref.where('userId', '==', id).orderBy('date')).snapshotChanges().pipe(map(
      ans => ans.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data(), date: new Date(d.payload.doc.data().date) }))));
  }

  /**
   * Deletes all the purchases of an user. Should be used when deleting a user.
   * @param id the id of the product.
   */
  async deletepurchasesFrom(id: string) {
    var purchases: Purchases[];
    var subscription = this.GetAllFromUser(id).subscribe(async ans => {
      purchases = ans;
      const batch = this.fireDatabase.firestore.batch();
      purchases.forEach(value => {
        var ref = this.fireDatabase.firestore.collection(this.collection).doc(value.id);
        batch.delete(ref);
      });
      await batch.commit();
      subscription.unsubscribe();
    });
  }
}
