import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private firestore: AngularFirestore) { }

  getAllUsers(): Observable<User[]> {
    return this.firestore.collection<User>('users').valueChanges();
  }

  getUserData(uid: string): Observable<User> {
    return this.firestore.collection('users').doc<User>(uid).valueChanges();
  }
}
