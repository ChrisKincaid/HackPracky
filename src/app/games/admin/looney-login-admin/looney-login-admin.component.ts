import { Component, OnInit } from '@angular/core';
import { LooneyLoginService } from 'src/app/services/looney-login.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-looney-login-admin',
  templateUrl: './looney-login-admin.component.html',
  styleUrls: ['./looney-login-admin.component.css']
})
export class LooneyLoginAdminComponent implements OnInit {

  authUser$:      Observable<User | null>;
  firestoreUser:  User | null;

  gameStatus: boolean;
  constructor(public looneyLoginService:  LooneyLoginService,
              private userService:        UserService,
              private toastr:             ToastrService,
              private firestore:          AngularFirestore,
              public authService:         AuthService,
              private cdr:                ChangeDetectorRef) { }

  ngOnInit(): void {
    this.looneyLoginService.gameStatus$.subscribe(gameStatus => {
      this.gameStatus = gameStatus;
      this.cdr.detectChanges();
      console.log('gameStatus: ', this.gameStatus);
      this.authUser$ = this.authService.getUser();
      this.authUser$.subscribe(user =>  {
          if (user) {
            this.userService.getCurrentUserData(user.uid).subscribe(
              firestoreUser => {
                this.firestoreUser = firestoreUser;
              });
          }
        });
    });
  }

  startGame(): void {
    this.looneyLoginService.startGame();
  };

  startGameEASY(): void {
    this.looneyLoginService.startGameEASY();
  };

  startGameSUPEREASY(): void {
    this.looneyLoginService.startGameSUPEREASY();
  };

  stopGame(): void {
    this.looneyLoginService.stopGame();
    this.userService.resetPoints('points001');
    this.toastr.success('Game ended and reset successfully.');
  };
}
