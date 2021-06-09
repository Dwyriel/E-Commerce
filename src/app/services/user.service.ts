import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User, UserType } from '../structure/user';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private collection = "Users";

  constructor(
    private fireDatabase: AngularFirestore,
    /**The Firebase authenticator used to log in, change or retrieve logged user*/
    public auth: AngularFireAuth
  ) { }

  /**
   * Creates a new user on the database and uses that user to log in.
   * @param user the variable containing the name, email, password and telephone.
   */
  async AddUser(user: User) {
    return await this.auth.createUserWithEmailAndPassword(user.email, user.password).then(async ans => {
      try {
        return this.fireDatabase.collection(this.collection).doc(ans.user.uid).set({
          name: user.name,
          email: user.email,
          tel: user.tel,
          userType: UserType.User,
          active: true,
        });
      } catch (e) {
        this.auth.user.subscribe(ans_1 => ans_1.delete());
      }
    });
  }

  /**
   * Retrieves all user from the database.
   * @returns a observable containing an array with all entries on the database.
   */
  async GetAll() {
    return this.fireDatabase.collection<User>(this.collection).snapshotChanges().pipe(map(
      ans => ans.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data(), calculateAvgRating: new User().calculateAvgRating }))
    ));
  }

  /**
   * Retrieves the user with the specified id.
   * @param id the user's id.
   * @returns a observable containing an object with the user's data.
   */
  async Get(id: string) {
    return this.fireDatabase.collection(this.collection).doc<User>(id).valueChanges();
  }

  /** DO NOT USE.
   * Not functional as off yet.
   */
  async Update(user: User) {//todo implement firebase's update account thingy. code to use:
    /*this.auth.currentUser.then(ans => {ans.updatePassword(user.password)});
    this.auth.currentUser.then(ans => {ans.updateEmail(user.email)});*/
    return await this.fireDatabase.collection(this.collection).doc(user.id).update({
      name: user.name,
      email: user.email,
      tel: user.tel,
    });
  }

  /** Updates the userType on the specified user.
   * @param id the user's id.
   * @param userType the new type that will be attributed to the user.
   */
  async UpdateType(id: string, userType: UserType) {
    return await this.fireDatabase.collection(this.collection).doc(id).update({ userType: userType });
  }

  /** Changes the active attribute on the specified user.
   * @param id the user's id.
   * @param active the new active value that will be attributed to the user.
   */
  async UpdateActive(id: string, active: boolean) {
    return await this.fireDatabase.collection(this.collection).doc(id).update({ active: active });
  }

  /** Updates the photo on the specified user.
   * @param id the user's id.
   * @param photo the user's new photo.
   */
  async UpdatePhoto(id: string, photo: string) {
    return await this.fireDatabase.collection(this.collection).doc(id).update({ photo: photo });
  }

  /** Adds or updates the user's address.
   * @param id the user's id.
   * @param address the address's id on the database.
   */
  async UpdateAddress(id: string, address: string) {
    return await this.fireDatabase.collection(this.collection).doc(id).update({ addressId: address });
  }

  /** Adds or updates the user's cart.
   * @param id the user's id.
   * @param cart the object that represents the cart.
   */
  async UpdateCart(id: string, cart: { productID: string, amount: number }[]) {
    return await this.fireDatabase.collection(this.collection).doc(id).update({ cart: [...cart] });
  }
  async UpdateProdList(id: string, user: User) {
    return await this.fireDatabase.collection(this.collection).doc(id).update({
        viewList: user.viewList

    });
  }

  /** WARNING: DANGEROUS. 
   * deletes the user's information on the database. should be used with a lot of caution. 
   * @param id the user's id.
   */
  async Delete(id: string) {
    return await this.fireDatabase.collection(this.collection).doc(id).delete();
  }
}
