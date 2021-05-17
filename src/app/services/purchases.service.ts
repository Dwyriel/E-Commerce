import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Purchase, State } from "../structure/purchases";

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
  async Add(purchases: Purchase) {
    return await this.fireDatabase.collection(this.collection).add({
      state: purchases.state,
      userId: purchases.userId,
      sellerId: purchases.sellerId,
      item: { ...purchases.item },
      date: new Date().getTime(),
    });
  }

  /**
   * Retrieves the purchase with the specified id.
   * @param id the purchase's id.
   * @returns a observable containing an object with the purchase's data.
   */
  async Get(id: string) {
    return this.fireDatabase.collection(this.collection).doc<Purchase>(id).valueChanges();
  }

  /**
   * Retrieves all the purchases of an user.
   * @param id the id of the user.
   * @returns an observable containing all the user's purchases.
   */
  async GetAllFromUser(id: string) {
    return this.fireDatabase.collection<Purchase>(this.collection, ref => ref.where('userId', '==', id).orderBy('date', "desc")).snapshotChanges().pipe(map(ans => ans.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data(), date: new Date(d.payload.doc.data().date), finishDate: (d.payload.doc.data().finishDate) ? new Date(d.payload.doc.data().finishDate) : undefined }))));
  }

  /**
   * Retrieves all the sales of a seller.
   * @param id the id of the seller.
   * @returns an observable containing all the seller's sales.
   */
  async GetAllFromSeller(id: string) {
    return this.fireDatabase.collection<Purchase>(this.collection, ref => ref.where('sellerId', '==', id).orderBy('date', "desc")).snapshotChanges().pipe(map(
      ans => ans.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data(), date: new Date(d.payload.doc.data().date) }))));
  }

  /**
   * Updates the state of a purchase
   * @param id the id of the purchase.
   * @param state the new state that the purchase will receive.
   */
  updateState(id: string, state: State) {
    return this.fireDatabase.collection(this.collection).doc(id).update({ state: state, finishDate: (state == State.Entregue) ? new Date().getTime() : null });
  }

  /**
   * Deletes all the purchases of an user. Should be used when deleting a user.
   * @param id the id of the product.
   */
  async deletepurchasesFrom(id: string) {
    var purchases: Purchase[];
    var subscription = (await this.GetAllFromUser(id)).subscribe(async ans => {
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

  /**
   * Deletes a single purchase. Use for error handling.
   * @param id the id of the purchase.
   */
  async deletePurchase(id: string) {
    return this.fireDatabase.collection(this.collection).doc(id).delete();
  }
}
