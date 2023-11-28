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
    // console.log(uid);
    return this.firestore.collection('users').doc<User>(uid).valueChanges();
  }

  updateCurrentUserPoints(uid: string, points: number) {
    console.log('points updated');
    return this.firestore.collection('users').doc<User>(uid).update({ points001: points });
  }

  // other methods related to current user...
}
