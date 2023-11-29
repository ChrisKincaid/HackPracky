import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { LooneyLoginService } from 'src/app/services/looney-login.service';
import { UserService } from 'src/app/services/user.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as CryptoJS from 'crypto-js';
import { ToastrService } from 'ngx-toastr';

import { CredsLooneyLogins } from 'src/app/interfaces/creds-looney-logins';

@Component({
  selector: 'app-looney-login',
  templateUrl: './looney-login.component.html',
  styleUrls: ['./looney-login.component.css']
})
export class LooneyLoginComponent implements OnInit {
  authUser$:      Observable<User | null>;
  firestoreUser:  User | null;
  countdown:      string = '00.00.00';
  hash:           string;
  order:          number;

  constructor(public looneyLoginService:  LooneyLoginService,
              public authService:         AuthService,
              public userService:         UserService,
              private cdr:                ChangeDetectorRef,
              private firestore:          AngularFirestore,
              private toastr:             ToastrService) { }

  ngOnInit(): void {
    this.authUser$ = this.authService.getUser();
    this.authUser$.subscribe(user => {
      if (user) {
        this.userService.getCurrentUserData(user.uid).subscribe(firestoreUser => {
          this.firestoreUser = firestoreUser;
        });
      }

      this.looneyLoginService.getLowestOrderHash().then(hash => {
        this.hash = hash;
        this.order = this.looneyLoginService.order;
        this.cdr.detectChanges();
        console.log('The current hash ingame ui:', this.hash);
      });
    });
  } // End of ngOnInit()

  checkPassword(input: string, inputField: HTMLInputElement): void {
    const hashedInput = CryptoJS.SHA256(input).toString();
    if (hashedInput === this.hash) {
      console.log('The input matches the hash');
      this.looneyLoginService.removeLowestOrderHash()
      this.toastr.success('YOU GOT A CORRECT PASSWORD!!!!')
      this.updateUserPoints();

    } else {
      console.log('The input does not match the hash');
    }
    inputField.value = ''; // reset the input field
  }

  updateUserPoints(): void {
    console.log('updateUserPoints called');
    if (this.firestoreUser) {
      console.log('points001:', this.firestoreUser.points001);
      console.log('order:', this.order);
      const newPoints = this.firestoreUser.points001 + (this.order * 10);
      this.userService.updateCurrentUserPoints(this.firestoreUser.uid, newPoints);
    }
  }

} // End of export class LooneyLoginComponent implements OnInit
