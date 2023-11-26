import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LooneyLoginService {

  constructor() { }

  generateHashStrings(): void {
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

        result.push({
          order: order++,
          name: charSets.slice(0, i).map(set => set.name).join(', '),
          value: hashString,
          charCount: selectedChars.length
        });
      }

      console.log(`${i} characters:`);
      for (let j = 0; j < result.length; j++) {
        console.log(` Order: ${result[j].order},
                      Name: ${result[j].name},
                      charCount: ${result[j].charCount},
                      HashedString: ${result[j].value}`);
      }
      console.log('------------------------');
    }
  }
}
