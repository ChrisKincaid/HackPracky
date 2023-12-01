import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, async } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { LooneyLoginService } from 'src/app/services/looney-login.service';
import { UserService } from 'src/app/services/user.service';
import * as CryptoJS from 'crypto-js';
import { ToastrService } from 'ngx-toastr';
import { delay, map, startWith } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';

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
  currentPWInfo: any;
  scoreboard$: Observable<any[]>;
  private gameEventsSubscription: Subscription;
  isLoading$ = this.looneyLoginService.gameStatus$.pipe(startWith(true), delay(1000));

  private triggerListener: any;
  private isTriggered: boolean = false;

  gameDetails$: Observable<any[]>;

  getGameDetails(): Observable<any[]> {
    return this.firestore.collection('looney-login-hashes').valueChanges();
  }

  messages = [
    'Oops! Wrong password. Try again!',           'Incorrect password. Give it another shot.',
    'Nope, not this time. Retry!',                'Wrong password. Keep guessing!',
    'Almost there, but not quite. Try again!',    'Oops! Wrong password. Another attempt?',
    'Incorrect password. Keep trying!',           'Nope, that\'s not it. Give it another go!',
    'Wrong password. Better luck next time!',     'Incorrect password. Keep going!',
    'Oops! Wrong password. Another try?',         'Wrong answer! Try a new password.',
    'Nope, that\'s not your magic word. Retry!',  'Incorrect password. Keep guessing!',
    'Almost had it! Try again.',                  'Oops! Wrong password. One more shot?',
    'Incorrect password. Keep trying!',           'Nope, not this time. Try again!',
    'Wrong password. Another attempt?',           'Incorrect password. Keep trying!',
    'Figure it out already.',                     'Are you trying to hack me?',
    'You\'re getting closer.',                    'You\'re getting colder.',
    'You\'re getting warmer.',                    'Ouch! Wrong passwords hurt.',
    'You\'re so close!',                          'Totally wrong, dude!',
    'You\'re in!!! Just kidding. Try again.'
  ];


  constructor(public looneyLoginService:  LooneyLoginService,
              public authService:         AuthService,
              public userService:         UserService,
              private cdr:                ChangeDetectorRef,
              private firestore:          AngularFirestore,
              private toastr:             ToastrService) { }

  ngOnInit(): void {

    // this.gameDetails$ = this.firestore.collection("looney-login-hashes").valueChanges();
    this.gameDetails$ = this.looneyLoginService.getGameDetails()

    this.gameDetails$.subscribe(gameDetails => {
      this.currentPWInfo = gameDetails;
    });


    this.authUser$ = this.authService.getUser();
    this.authUser$.subscribe(user => {
      if (user) {
        this.userService.getCurrentUserData(user.uid).subscribe(firestoreUser => {
          this.firestoreUser = firestoreUser;
        });
      }

      this.looneyLoginService.currentPWInfo$.subscribe(currentPWInfo => {
        this.currentPWInfo = currentPWInfo;
        console.log('currentPWInfo:', currentPWInfo);
      });

      // this.updateHash();
    });

    this.scoreboard$ = this.firestore.collection(
      "users", ref => ref.where(
        'points001', '>', 0).orderBy('points001', 'desc')).valueChanges();

        this.gameDetails$ = this.firestore.collection(
          "looney-login-hashes",
          ref => ref.orderBy('order', 'asc').limit(1)).valueChanges();
        // .snapshotChanges().pipe(
          // map(actions => actions.map(a => {
            // const data = a.payload.doc.data() as {
              // charCount: number, name: string, order: number };
            // const id = a.payload.doc.id;
            // return { id, ...data };
          // }))
        // );


  } // End of ngOnInit()

  // async updateHash(): Promise<void> {
  //   // debugger
  //   (await this.looneyLoginService.getLowestOrderHash()).subscribe(hash => {
  //     this.hash = hash;
  //     // console.log('This:', this);
  //     this.order = this.looneyLoginService.order;
  //     // console.log('The hash:', this.hash);
  //     this.cdr.detectChanges();
  //   });
  // }

  async checkPassword(input: string, inputField: HTMLInputElement): Promise<void>  {
    if (this.authService.isLoggedIn) {
      this.toastr.success('Must be logged in to play.', '', {
        positionClass: 'toast-center-center'
      });
      return;
    }
    const hashedInput = CryptoJS.SHA256(input).toString();
    console.log('This hash check:', this.currentPWInfo[0]?.value);

    if (hashedInput === this.currentPWInfo[0]?.value) {
      this.toastr.success('YOU GOT A CORRECT PASSWORD!!!!')
      this.looneyLoginService.removeLowestOrderHash().then(() => {
        this.updateUserPoints();
        // this.updateHash();
      });

    } else {
      const randomMessage = this.messages[Math.floor(Math.random() * this.messages.length)];
      this.toastr.show(randomMessage);
    }
    inputField.value = ''; // reset the input field
  }

  updateUserPoints(): void {
    if (this.firestoreUser) {
      const newPoints = this.firestoreUser.points001 + (this.order * 10);
      this.userService.updateCurrentUserPoints(this.firestoreUser.uid, newPoints);
    }
  }

} // End of export class LooneyLoginComponent implements OnInit
