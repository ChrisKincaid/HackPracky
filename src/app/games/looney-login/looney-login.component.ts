import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { LooneyLoginService } from 'src/app/services/looney-login.service';
import { UserService } from 'src/app/services/user.service';
// import { CountdownService } from 'src/app/services/countdown.service';

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
              public userService: UserService) { }
              // public countdownService: CountdownService) { }

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

    // this.countdownService.countdown$.subscribe(countdown => {
    //   this.countdown = countdown;
    // });
  } // End of ngOnInit()

  generateHashStrings(): void {
    this.looneyLoginService.generateHashStrings();
  }

  // countdown clock code --------------------- Start



  // countdown clock code --------------------- End



}
