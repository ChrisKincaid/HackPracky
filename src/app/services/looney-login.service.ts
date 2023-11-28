import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class LooneyLoginService {

  constructor(private firestore: AngularFirestore) { }


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
      let result: { order: number, name: string, value: string, charCount: number}[] = [];

      for (let j = 1; j<= 4; j++) {
        let selectedChars: string = '';

        for (let k = 1; k <= i; k++) {
          const randomSetIndex = Math.floor(Math.random() * charSets.length);
          const randomChar = charSets[randomSetIndex].chars[Math.floor(Math.random() * charSets[randomSetIndex].chars.length)];
          selectedChars += randomChar;
        }

        // HASHING
        const hashString = CryptoJS.SHA256(selectedChars).toString(CryptoJS.enc.Hex);

        // result.push({
        const hashData = {
          order: order++,
          name: charSets.slice(0, i).map(set => set.name).join(', '),
          value: hashString,
          charCount: selectedChars.length
        };
        // });
        // this.firestore.collection('looney-login-hashes').add(hashData);
        const docRef = collectionRef.doc(order.toString()).ref;
        batch.set(docRef, hashData);
      };
    }

   // Commit the batch
   batch.commit().then(() => {
    console.log('All documents in the looney-login-hashes collection have been replaced.');
  });
});
}

  }
