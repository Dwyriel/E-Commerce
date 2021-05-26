import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { PurchaseChat } from '../structure/purchase-chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private collection: string = "PurchaseChat";

  constructor(private fireDatabase: AngularFirestore) { }

  /**
   * Creates a new document on the database containing an user's message.
   * @param chat the object of type PurchaseChat that will be saved on the database.
   */
  async Add(chat: PurchaseChat) {
    return await this.fireDatabase.collection(this.collection).add({
      purchaseId: chat.purchaseId,
      buyerId: chat.buyerId,
      sellerId: chat.sellerId,
      message: chat.message,
      date: new Date().getTime(),
    });
  }

  /**
   * Retrieves the PurchaseChat with the corresponding id.
   * @param id the id of the PurchaseChat.
   */
  async Get(id: string) {
    return this.fireDatabase.collection(this.collection).doc<PurchaseChat>(id).valueChanges();
  }

  /**
   * Retrieves all the PurchaseChats of one Purchase.
   * @param id the id of the Purchase.
   * @returns an observable containing all the Purchase's PurchaseChat.
   */
  async GetAllFromPurchase(id: string) {
    return this.fireDatabase.collection<PurchaseChat>(this.collection, ref => ref.where('purchaseId', '==', id).orderBy('date', 'desc')).snapshotChanges().pipe(map(
      ans => ans.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data(), date: new Date(d.payload.doc.data().date) }))));
  }

  /** Updates the message of a PurchaseChat.
   * @param id the id of the PurchaseChat.
   * @param message the message of the PurchaseChat
   */
  async Update(id: string, message: string) {
    return await this.fireDatabase.collection(this.collection).doc(id).update({
      message: message
    });
  }

  /**
   * Deletes all the PurchaseChats of one purchase. Should be used when deleting a purchase.
   * @param id the id of the purchase.
   */
  async deletePurchaseChatsFrom(id: string) {
    var PurchaseChats: PurchaseChat[];
    var subscription = (await this.GetAllFromPurchase(id)).subscribe(async ans => {
      PurchaseChats = ans;
      const batch = this.fireDatabase.firestore.batch();
      PurchaseChats.forEach(value => {
        var ref = this.fireDatabase.firestore.collection(this.collection).doc(value.id);
        batch.delete(ref);
      });
      await batch.commit();
      subscription.unsubscribe();
    });
  }

  /**
   * deletes a specific PurchaseChat.
   * @param id the PurchaseChat's id.
   */
  async Delete(id: string) {
    return await this.fireDatabase.collection(this.collection).doc(id).delete();
  }
}
