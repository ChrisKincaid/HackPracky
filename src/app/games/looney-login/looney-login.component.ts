import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { LooneyLoginService } from 'src/app/services/looney-login.service';
import { UserService } from 'src/app/services/user.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CredsLooneyLogins } from 'src/app/interfaces/creds-looney-logins';

@Component({
  selector: 'app-looney-login',
  templateUrl: './looney-login.component.html',
  styleUrls: ['./looney-login.component.css']
})
export class LooneyLoginComponent implements OnInit {
  authUser$: Observable<User | null>;
  firestoreUser: User | null;
  countdown: string = '00.00.00';

  constructor(private looneyLoginService: LooneyLoginService,
              public authService: AuthService,
              public userService: UserService,
              private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.authUser$ = this.authService.getUser();
    this.authUser$.subscribe(user => {
      if (user) {
        this.userService.getCurrentUserData(user.uid).subscribe(firestoreUser => {
          // console.log(firestoreUser); // this should log the entire user document data
          this.firestoreUser = firestoreUser;
        });
      }
    });
  } // End of ngOnInit()
}
