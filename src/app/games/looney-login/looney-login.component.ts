import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { LooneyLoginService } from 'src/app/services/looney-login.service';
import { UserService } from 'src/app/services/user.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CredsLooneyLogins } from 'src/app/interfaces/creds-looney-logins';
import * as CryptoJS from 'crypto-js';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-looney-login',
  templateUrl: './looney-login.component.html',
  styleUrls: ['./looney-login.component.css']
})
export class LooneyLoginComponent implements OnInit {
  authUser$: Observable<User | null>;
  firestoreUser: User | null;
  countdown: string = '00.00.00';
  hash: string;
  order: number;

  constructor(public looneyLoginService: LooneyLoginService,
              public authService: AuthService,
              public userService: UserService,
              private cdr: ChangeDetectorRef,
              private firestore: AngularFirestore,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    // console.log('ngOnInit called');
    this.authUser$ = this.authService.getUser();
    this.authUser$.subscribe(user => {
      if (user) {
        this.userService.getCurrentUserData(user.uid).subscribe(firestoreUser => {
          // console.log(firestoreUser); // this should log the entire user document data
          this.firestoreUser = firestoreUser;
        });
      }

      this.looneyLoginService.getLowestOrderHash().then(hash => {
        this.hash = hash;
        this.order = this.looneyLoginService.order;
        this.cdr.detectChanges();
        console.log('The current hash ingame ui:', this.hash);
      });
      // this.looneyLoginService.hash.subscribe(hash => {
      //   this.hash = hash;
      //   this.cdr.detectChanges();
      // });
    });
  } // End of ngOnInit()

  checkPassword(input: string, inputField: HTMLInputElement): void {
    // console.log('checkPassword called with input:', input);
    const hashedInput = CryptoJS.SHA256(input).toString();
    // console.log('hashedInput:', hashedInput);
    // console.log('this.hash:', this.hash);
    if (hashedInput === this.hash) {
      console.log('The input matches the hash');
      this.updateUserPoints();
      this.toastr.success('YOU GOT A CORRECT PASSWORD!!!!')
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


}
