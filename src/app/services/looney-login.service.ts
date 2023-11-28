import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LooneyLoginService {
  gameStatus$: Observable<boolean>;
  gameStatus: boolean;
  private hashSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  hash$: Observable<string> = this.hashSubject.asObservable();
  order: number;

  constructor(private toastr: ToastrService,
              private firestore: AngularFirestore) {
                this.gameStatus$ = this.firestore.doc<{ gameStatus: boolean }>('games/looneyLoginGameStatus').valueChanges()
              .pipe(map(doc => doc.gameStatus));

              this.gameStatus$.subscribe(gameStatus => {
                this.gameStatus = gameStatus;
              });
            }

            async startGame(): Promise<void>  {
              await this.getLowestOrderHash()
              console.log('The current hash:', this.hashSubject);
              this.firestore.doc('games/looneyLoginGameStatus')
              .set({ gameStatus: true }, { merge: true })
              .then(() => {
                this.toastr.success('Game started', 'Looney Login');
              }).catch((error) => {
                this.toastr.error('Something went wrong. Game not started',
                 'Looney Login');
              });
              console.log('The current hash in service:', this.hashSubject);
            }

            stopGame(): void {
              this.generateHashStrings()
              this.firestore.doc('games/looneyLoginGameStatus')
              .set({ gameStatus: false }, { merge: false })
              .then(() => {
                this.toastr.success('Game ended', 'Looney Login');
              }).catch((error) => {
                this.toastr.error('Something went wrong. Game not ended',
                 'Looney Login');
              });
              // this.getLowestOrderHash()

            }




  getLowestOrderHash(): Promise<any> {
    return this.firestore.collection('looney-login-hashes', ref => ref
      .orderBy('order').limit(1))
      .get()
      .toPromise()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data() as any;
          this.hashSubject.next(data.value);
          this.order = data.order;
          console.log('The lowest order hash:', this.hashSubject.value);
          return data.value;
        } else {
          throw new Error('No documents found');
        }
      });
  }

  removeLowestOrderHash(): Promise<void> {
    return this.firestore.collection('looney-login-hashes', ref => ref
      .orderBy('order').limit(1))
      .get()
      .toPromise()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          return docRef.delete();
        } else {
          throw new Error('No documents found');
        }
      });
  }
//Generating fake password hashes for game and uploading to db
  generateHashStrings(): void {
    const collectionRef = this.firestore.collection('looney-login-hashes');
    const batch = this.firestore.firestore.batch();

    // Delete all documents in the collection
    collectionRef.get().toPromise().then(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      const charSets = [
        { name: 'lowercase', chars: 'abcdefghijklmnopqrstuvwxyz' },
        { name: 'uppercase', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
        { name: 'numbers', chars: '0123456789' },
        { name: 'special', chars: '!@#$%^&*_+~|?><.' }
      ];

      let order = 1;

      for (let i = 1; i <= 25; i++) {
        for (let j = 1; j <= 4; j++) {
          let selectedChars: string = '';

          // Define the character sets for the current iteration
          const activeCharSets = charSets.slice(0, j);

          for (let k = 1; k <= i; k++) {
            const randomSetIndex = Math.floor(Math.random() * activeCharSets.length);
            const randomChar = activeCharSets[randomSetIndex].chars[Math.floor(Math.random() * activeCharSets[randomSetIndex].chars.length)];
            selectedChars += randomChar;
          }

          const hashString = CryptoJS.SHA256(selectedChars).toString(CryptoJS.enc.Hex);

          const hashData = {
            order: order,
            name: activeCharSets.map(set => set.name).join(', '),
            value: hashString,
            charCount: selectedChars.length,
            input: selectedChars
          };

          const docRef = collectionRef.doc(order.toString()).ref;
          batch.set(docRef, hashData);

          order++; // Increment order after each combination
        }
      }

      // Commit the batch
      batch.commit().then(() => {
        console.log('All documents in the looney-login-hashes collection have been replaced.');
      });
    });
  }
}
