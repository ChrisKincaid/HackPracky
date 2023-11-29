import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore) { }

  getCurrentUserData(uid: string): Observable<User> {
    return this.firestore.collection('users').doc<User>(uid).valueChanges();
  }

  updateCurrentUserPoints(uid: string, points: number) {
    console.log('points updated');
    return this.firestore.collection('users').doc<User>(uid).update({ points001: points });
  }

  resetPoints(points: string): Promise<void> {
    return this.firestore.collection('users').get().toPromise().then(querySnapshot => {
      const batch = this.firestore.firestore.batch();

      querySnapshot.docs.forEach(doc => {
        const docRef = this.firestore.doc(`users/${doc.id}`).ref;
        batch.update(docRef, { points001: 0 });
      });

      return batch.commit();
    });
  }
  // other methods related to current user... ??
}
