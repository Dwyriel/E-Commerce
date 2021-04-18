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
      recommend: review.recommend,
      title: review.title,
      text: review.text,
      userID: review.userID,
      productID: review.productID,
      date: new Date().getTime(),
    });
  }

  /**
   * Retrieves all the reviews of one product.
   * @param id the id of the product.
   */
  GetAllFromProduct(id: string) {
    return this.fireDatabase.collection<Review>(this.collection, ref => ref.where('productID', '==', id).orderBy('date')).snapshotChanges().pipe(map(
      ans => ans.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data(), date: new Date(d.payload.doc.data().date) }))));
  }

  /**
   * Deletes all the reviews of one product. Should be used when deleting a product.
   * @param id the id of the product.
   */
  async deleteReviewsFrom(id: string) {
    var reviews: Review[];
    var subscription = this.GetAllFromProduct(id).subscribe(async ans => {
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
}
