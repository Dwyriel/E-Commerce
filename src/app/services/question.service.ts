import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Question } from '../structure/question';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private collection: string = "Questions";

  constructor(private fireDatabase: AngularFirestore) { }

  async add(question: Question, Idprod: string) {
    return await this.fireDatabase.collection(this.collection).add({
      productId: Idprod,
      text: question.text,
      idUser: question.idUser,
      date: new Date().getTime(),
      hasReply: question.hasReply = false,
    });
  }

  async update(question: Question) {
    return this.fireDatabase.collection(this.collection).doc(question.id).update({
      vendorText: question.vendorText,
      replyDate: new Date().getTime(),
      hasReply: question.hasReply = true,
    });
  }

  async getQuestions(id: string) {
    return this.fireDatabase.collection<Question>(this.collection, ref => ref.where('productId', '==', id).orderBy('date')).snapshotChanges().pipe(map(
      ans => ans.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data(), date: new Date(d.payload.doc.data().date), replyDate: new Date(d.payload.doc.data().replyDate) }))));
  }
}
