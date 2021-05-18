import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Review } from '../structure/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private collection: string = "Reviews";

  constructor(private fireDatabase: AngularFirestore) { }

  /**
   * Creates a new review on the database.
   * @param review the object of type Review that will be saved on the database.
   */
  async Add(review: Review) {
    return await this.fireDatabase.collection(this.collection).add({
      userID: review.userID,
      productID: review.productID,
      linkedPurchaseId: review.linkedPurchaseId,
      title: review.title,
      text: review.text,
      recommend: review.recommend,
      date: new Date().getTime(),
    });
  }

  /**
   * Retrieves all the reviews of one product.
   * @param id the id of the product.
   * @returns an observable containing all the product's review.
   */
  async GetAllFromProduct(id: string) {
    return this.fireDatabase.collection<Review>(this.collection, ref => ref.where('productID', '==', id).orderBy('date', 'desc')).snapshotChanges().pipe(map(
      ans => ans.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data(), date: new Date(d.payload.doc.data().date) }))));
  }

  /**
   * Retrieve the review with the specified linkedPurchaseId.
   * @param linkedPurchaseId the id of the purchase.
   * @returns an observable containing the review of the product linked to a purchase.
   */
  async GetReviewFromPurchase(linkedPurchaseId: string) {
    return this.fireDatabase.collection<Review>(this.collection, ref => ref.where('linkedPurchaseId', '==', linkedPurchaseId)).snapshotChanges().pipe(map(
      ans => ans.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data(), date: new Date(d.payload.doc.data().date) }))));
  }

  /** Updates the review of a product.
   * @param id the id of the review.
   * @param others the attributes of the review
   */
  async Update(id: string, title: string, text: string, recommend: boolean) {
    return await this.fireDatabase.collection(this.collection).doc(id).update({
      title: title,
      text: text,
      recommend: recommend,
    });
  }

  /**
   * Deletes all the reviews of one product. Should be used when deleting a product.
   * @param id the id of the product.
   */
  async deleteReviewsFrom(id: string) {
    var reviews: Review[];
    var subscription = (await this.GetAllFromProduct(id)).subscribe(async ans => {
      reviews = ans;
      const batch = this.fireDatabase.firestore.batch();
      reviews.forEach(value => {
        var ref = this.fireDatabase.firestore.collection(this.collection).doc(value.id);
        batch.delete(ref);
      });
      await batch.commit();
      subscription.unsubscribe();
    });
  }

  /**
   * deletes a specific review.
   * @param id the review's id.
   */
  async Delete(id: string) {
    return await this.fireDatabase.collection(this.collection).doc(id).delete();
  }
}
