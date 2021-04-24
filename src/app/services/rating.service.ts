import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Rating } from '../structure/rating';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private collection: string = "Ratings";

  constructor(private fireDatabase: AngularFirestore) { }

  /**
   * Creates a new rating on the database.
   * @param rating the object of type Rating that will be saved on the database.
   */
  async Add(rating: Rating) {
    return await this.fireDatabase.collection(this.collection).add({
      recommend: rating.recommend,
      ratedUserId: rating.ratedUserId,
      raterUserId: rating.raterUserId,
      linkedPurchaseId: rating.linkedPurchaseId,
      date: new Date().getTime(),
    });
  }

  /**
   * Retrieves all the ratings of one user.
   * @param id the id of the user.
   * @returns an observable containing all the user's rating.
   */
  async GetAllFromUser(id: string) {
    return this.fireDatabase.collection<Rating>(this.collection, ref => ref.where('ratedUserId', '==', id)).snapshotChanges().pipe(map(
      ans => ans.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data(), date: new Date(d.payload.doc.data().date) }))));
  }

  /**
   * Deletes all the ratings of one user. Should be used when deleting a user.
   * @param id the id of the user.
   */
  async deleteRatingsFrom(id: string) {
    var ratings: Rating[];
    var subscription = (await this.GetAllFromUser(id)).subscribe(async ans => {
      ratings = ans;
      const batch = this.fireDatabase.firestore.batch();
      ratings.forEach(value => {
        var ref = this.fireDatabase.firestore.collection(this.collection).doc(value.id);
        batch.delete(ref);
      });
      await batch.commit();
      subscription.unsubscribe();
    });
  }
}