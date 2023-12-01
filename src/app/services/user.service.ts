import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of, switchMap, take } from 'rxjs';
import { User } from '../interfaces/user';
import { LeaderBoard } from '../interfaces/leader-board';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore:  AngularFirestore,
              private toastr:     ToastrService) { }


  createLeaderBoardDocument() {
    const initialLeaderBoard: LeaderBoard = {
      points001Best: [],  points002Best: [],  points003Best: [],  points004Best: [],
      points005Best: [],  points006Best: [],  points007Best: [],  points008Best: [],
      points009Best: [],  points010Best: [],  points011Best: [],  points012Best: [],
      points013Best: [],  points014Best: [],  points015Best: [],  points016Best: [],
      points017Best: [],  points018Best: [],  points019Best: [],  points020Best: []
    };

    const docRef = this.firestore.collection('leaderboards').doc('leaderboardId');

    docRef.set(initialLeaderBoard);
  }





  getCurrentUserData(uid: string): Observable<User> {
    return this.firestore.collection('users').doc<User>(uid).valueChanges();
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


  updateCurrentUserPoints(uid: string, points: number, pointKey: string, userName: string) {
    // Get the user document
    const userDoc = this.firestore.collection('users').doc<User>(uid);

    // Get the user data
    userDoc.valueChanges().pipe(
      take(1),
      switchMap(user => {
        const userUpdate: any = {};
        const userPointKeyBest = `${pointKey}Best`;

        // If the provided pointKey is higher than the corresponding best point, update both user and leaderboard
        if (points > user[userPointKeyBest]?.value || !user[userPointKeyBest]) {
          userUpdate[pointKey] = points;
          userUpdate[userPointKeyBest] = { value: points, name: userName };
          this.toastr.success('New best score!');
          return userDoc.update(userUpdate);
        } else {
          userUpdate[pointKey] = points;
          return userDoc.update(userUpdate);
        }
      }),
      switchMap(() => {
        // Get the document from the leaderboard collection
        const leaderDoc = this.firestore.collection('leaderboards').doc<LeaderBoard>('leaderboardId');

        // Update the leaderboard only if the provided pointKey is higher than the current best point
        return leaderDoc.valueChanges().pipe(
          take(1),
          switchMap(leaderboardData => {
            const leaderboardUpdate: any = {};
            const leaderboardPointKeyBest = `points${pointKey.substring(6)}Best`;

            if (points > leaderboardData[leaderboardPointKeyBest]?.value || !leaderboardData[leaderboardPointKeyBest]) {
              leaderboardUpdate[leaderboardPointKeyBest] = { value: points, name: 'userName' }; // Replace 'userName' with actual user's name
              return leaderDoc.update(leaderboardUpdate);
            } else {
              console.log('HELLO');
              return of(null); // Do nothing
            }
          })
        );
      })
    ).subscribe();
  }



// OLD Function
  // updateCurrentUserPoints(uid: string, points: number) {
  //   return this.firestore.collection('users').doc<User>(uid).update({ points001: points });
  // }
}
