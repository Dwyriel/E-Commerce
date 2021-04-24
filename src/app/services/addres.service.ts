import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Address } from "../structure/address";

@Injectable({
  providedIn: 'root'
})
export class AddresService {//address is intentionally misspelled, otherwise there would be an internal error within typescript's own classes
  private collection: string = "Addresses";

  constructor(private fireDatabase: AngularFirestore) { }

  /**
   * Creates a new address entry on the database.
   * @param address the address that will be saved on the database.
   */
  async Add(address: Address) {
    return this.fireDatabase.collection(this.collection).add({
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
  async Get(id: string) {
    return this.fireDatabase.collection(this.collection).doc<Address>(id).valueChanges();
  }

  /**
   * Updates the address using the id provided.
   * @param address the object constaining the new address information.
   * @param id the id of the entry that should be changed.
   */
  async Update(address: Address, id: string) {
    return this.fireDatabase.collection(this.collection).doc(id).update({ address });
  }

  /**
   * Deletes the address entry corresponding to the provided id.
   * @param id the id of the entry that will be deleted.
   */
  async Delete(id: string) {
    return this.fireDatabase.collection(this.collection).doc(id).delete();
  }
}
