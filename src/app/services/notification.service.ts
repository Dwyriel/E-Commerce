import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AppNotification, GetIconForNotification } from '../structure/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private collection: string = "Notifications";

  constructor(private fireDatabase: AngularFirestore) { }

  /**
   * Creates a new notification on the database.
   * @param notification the object of type notification that will be saved on the database.
   */
  async Add(notification: AppNotification) {
    return await this.fireDatabase.collection(this.collection).add({
      text: notification.text,
      url: notification.url,
      userId: notification.userId,
      from: notification.from,
      date: new Date().getTime(),
    });
  }

  /**
   * Retrieves all the notification of one user.
   * @param id the id of the user.
   * @returns an observable containing all the user's notification.
   */
  async GetAllFromUser(id: string) {
    var notification = new AppNotification();
    return this.fireDatabase.collection<AppNotification>(this.collection, ref => ref.where('userId', '==', id)).snapshotChanges().pipe(map(
      ans => ans.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data(), date: new Date(d.payload.doc.data().date), icon: GetIconForNotification(d.payload.doc.data().from), equals: notification.equals, urlEquals: notification.urlEquals }))));
  }

  /**
   * Deletes all the notifications of one user.
   * @param id the id of the user.
   */
  async DeleteNotificationsFrom(id: string) {
    var notifications: AppNotification[];
    var shouldWait = true;
    var subscription = (await this.GetAllFromUser(id)).subscribe(async ans => {
      notifications = ans;
      const batch = this.fireDatabase.firestore.batch();
      notifications.forEach(value => {
        var ref = this.fireDatabase.firestore.collection(this.collection).doc(value.id);
        batch.delete(ref);
      });
      await batch.commit();
      subscription.unsubscribe();
      shouldWait = false;
    }, err => {
      shouldWait = false;
    });
    while (shouldWait)
      await new Promise(resolve => setTimeout(resolve, 10));
    return;
  }

  /**
   * deletes a specific notification. 
   * @param id the notification's id.
   */
  async Delete(id: string) {
    return await this.fireDatabase.collection(this.collection).doc(id).delete();
  }
}
