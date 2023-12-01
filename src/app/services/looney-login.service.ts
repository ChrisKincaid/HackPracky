import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, map } from 'rxjs';
import * as CryptoJS from 'crypto-js';
// import { AngularFireDatabase } from '@angular/fire/compat/database';

// import { CredsLooneyLogins } from 'src/app/interfaces/creds-looney-logins';


@Injectable({
  providedIn: 'root'
})
export class LooneyLoginService {
  gameStatus$: Observable<boolean>;
  gameStatus: boolean;

  getGameDetails(): Observable<any[]> {
    return this.firestore.collection('looney-login-hashes').valueChanges();
  }

  hashSubject:  BehaviorSubject<string> = new BehaviorSubject<string>('');
  order:        number;
  hash$:        Observable<string> = this.hashSubject.asObservable();
  currentPWInfo$ = new BehaviorSubject<any>({});
  name: BehaviorSubject<string> = new BehaviorSubject<string>('');
  charCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private toastr: ToastrService,
              private firestore: AngularFirestore) {
                this.gameStatus$ = this.firestore.doc<{
                  gameStatus: boolean }>('games/looneyLoginGameStatus')
                  .valueChanges()
                  .pipe(map(doc => doc.gameStatus
                ));
              this.gameStatus$.subscribe(gameStatus => {
                this.gameStatus = gameStatus;
              });
            } // End of constructor()

  async startGame(): Promise<void>  {
    await this.generateHashStrings()
    await this.getLowestOrderHash()
    this.firestore.doc('games/looneyLoginGameStatus')
      .set({ gameStatus: true }, { merge: true })
      .then(() => {
        this.toastr.success('Game started', 'Looney Login');
      }).catch((error) => {
      this.toastr.error('Something went wrong. Game not started',
        'Looney Login');
      });
  }

  async startGameEASY(): Promise<void>  {
    await this.generateHashStringsEASY()
    await this.getLowestOrderHash()
    this.firestore.doc('games/looneyLoginGameStatus')
      .set({ gameStatus: true }, { merge: true })
      .then(() => {
        this.toastr.success('Game started', 'Looney Login');
      }).catch((error) => {
      this.toastr.error('Something went wrong. Game not started',
        'Looney Login');
      });
  }

  async startGameSUPEREASY(): Promise<void>  {
    await this.generateHashStringsEASY()
    await this.getLowestOrderHash()
    this.firestore.doc('games/looneyLoginGameStatus')
      .set({ gameStatus: true }, { merge: true })
      .then(() => {
        this.toastr.success('Game started', 'Looney Login');
      }).catch((error) => {
      this.toastr.error('Something went wrong. Game not started',
        'Looney Login');
      });
  }

  stopGame(): void {
    // this.generateHashStrings()
    this.firestore.doc('games/looneyLoginGameStatus')
    .set({ gameStatus: false }, { merge: false })
    .then(() => {
      this.toastr.success('Game ended', 'Looney Login');
    }).catch((error) => {
      this.toastr.error('Something went wrong. Game not ended',
        'Looney Login');
    });

  }

  async getLowestOrderHash(): Promise<Observable<string>> {
    return this.firestore.collection('looney-login-hashes', ref => ref
      .orderBy('order').limit(1))
      .get()
      .pipe(
        map(querySnapshot => {
          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data() as any;
            this.hashSubject.next(data.value);
            this.order = data.order;
            // this.order.next(data.order);
            this.name.next(data.name);
            this.charCount = data.charCount;
            return data.value;
          } else {
            throw new Error('No documents found');
          }
        })
      );
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

  updatecurrentPWInfo(order: number, activeCharSets: any[], hashString: string, selectedChars: string[]) {
    const currentPWInfo = {
      order: order,
      name: activeCharSets.map(set => set.name).join(', '),
      value: hashString,
      charCount: selectedChars.length,
      input: selectedChars
    };
    this.currentPWInfo$.next(currentPWInfo);
  }

  //Generating fake password hashes for game and uploading to db DEFAULT MODE
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
        { name: 'numbers', chars: '0123456789' }
        // { name: 'special', chars: '!@#$%^&*_+~|?><.' }
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

          const currentPWInfo = {
            order: order,
            name: activeCharSets.map(set => set.name).join(', '),
            value: hashString,
            charCount: selectedChars.length,
            input: selectedChars
          };

          const docRef = collectionRef.doc(order.toString()).ref;
          batch.set(docRef, currentPWInfo);

          order++; // Increment order after each combination
        }
      }

      // Commit the batch
      batch.commit().then(() => {
      });
    });
  }

  // Generating fake password hashes for game and uploading to db EASY MODE
  generateHashStringsEASY(): void {
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
        { name: 'numbers', chars: '0123456789' }
        // { name: 'special', chars: '!@#$%^&*_+~|?><.' }
      ];

      let order = 1;

      for (let i = 1; i <= 8; i++) { // Adjusted the loop limit to 8
        for (let j = 1; j <= 8; j++) { // Changed the loop limit to 8
          let selectedChars: string = '';

          // Define the character sets for the current iteration
          const activeCharSets = charSets.slice(0, j);

          for (let k = 1; k <= i; k++) {
            const randomSetIndex = Math.floor(Math.random() * activeCharSets.length);
            const randomChar = activeCharSets[randomSetIndex].chars[Math.floor(Math.random() * activeCharSets[randomSetIndex].chars.length)];
            selectedChars += randomChar;
          }

          const hashString = CryptoJS.SHA256(selectedChars).toString(CryptoJS.enc.Hex);

          const currentPWInfo = {
            order: order,
            name: activeCharSets.map(set => set.name).join(', '),
            value: hashString,
            charCount: selectedChars.length,
            input: selectedChars
          };

          const docRef = collectionRef.doc(order.toString()).ref;
          batch.set(docRef, currentPWInfo);

          order++; // Increment order after each combination
        }
      }

      // Commit the batch
      batch.commit().then(() => {
      });
    });
  }

  // Generating fake password hashes for game and uploading to db SUPER EASY MODE
  generateHashStringsSUPEREASY(): void {
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
        { name: 'numbers', chars: '0123456789' }
        // { name: 'special', chars: '!@#$%^&*_+~|?><.' }
      ];

      let order = 1;

      for (let i = 1; i <= 4; i++) { // Adjusted the loop limit to 4 for characters
        for (let j = 1; j <= 16; j++) { // Changed the loop limit to 16 for times
          let selectedChars: string = '';

          // Define the character sets for the current iteration
          const activeCharSets = charSets.slice(0, j);

          for (let k = 1; k <= i; k++) {
            const randomSetIndex = Math.floor(Math.random() * activeCharSets.length);
            const randomChar = activeCharSets[randomSetIndex].chars[Math.floor(Math.random() * activeCharSets[randomSetIndex].chars.length)];
            selectedChars += randomChar;
          }

          const hashString = CryptoJS.SHA256(selectedChars).toString(CryptoJS.enc.Hex);

          const currentPWInfo = {
            order: order,
            name: activeCharSets.map(set => set.name).join(', '),
            value: hashString,
            charCount: selectedChars.length,
            input: selectedChars
          };

          const docRef = collectionRef.doc(order.toString()).ref;
          batch.set(docRef, currentPWInfo);

          order++; // Increment order after each combination
        }
      }

      // Commit the batch
      batch.commit().then(() => {
      });
    });
  }


}
