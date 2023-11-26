import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit{
  authUser$: Observable<User | null>;
  firestoreUser: User | null;
constructor(public authService: AuthService, public userService: UserService) {}


  ngOnInit(): void {
    this.authUser$ = this.authService.getUser();
    this.authUser$.subscribe(user => {
      if (user) {
        this.userService.getCurrentUserData(user.uid).subscribe(firestoreUser => {
          console.log(firestoreUser); // this should log the entire user document data
          this.firestoreUser = firestoreUser;
        });
      }
    });
  }


    logOut() {
      this.authService.logOut();
    }
  }

