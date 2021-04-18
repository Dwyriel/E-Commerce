import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AddresService {
  private colAddress: string = "Addresses";

  constructor(private fireDB: AngularFirestore) { }

  /**
   * Creates a new address entry on the database.
   * @param address the address that will be saved on the database.
   */
  Add(address: Address) {
    return this.fireDB.collection(this.colAddress).add({
      state: address.state,
      city: address.city,
      cep: address.cep,
      street: address.street,
      number: address.number
    });
  }

  /**
   * Retrieves the address using the id provided.
   * @param id the id that should be used to retrieve the address.
   */
  Get(id: string) {
    return this.fireDB.collection(this.colAddress).doc<Address>(id).valueChanges();
  }

  /**
   * Updates the address using the id provided.
   * @param address the object constaining the new address information.
   * @param id the id of the entry that should be changed.
   */
  Update(address: Address, id: string) {
    return this.fireDB.collection(this.colAddress).doc(id).update(address);
  }

  /**
   * Deletes the address entry corresponding to the provided id.
   * @param id the id of the entry that will be deleted.
   */
  Delete(id: string) {
    return this.fireDB.collection(this.colAddress).doc(id).delete();
  }
}
