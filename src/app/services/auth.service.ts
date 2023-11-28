import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = new BehaviorSubject<User | null>(null);

  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedInGuard: boolean = false;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private toastr: ToastrService,
    private router: Router
  ) {

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user.next({
          uid: user.uid,
          email: user.email,
          userName: user.email,
          points001: 0, points002: 0, points003: 0, points004: 0, points005: 0,
          points006: 0, points007: 0, points008: 0, points009: 0, points010: 0,
          points011: 0, points012: 0, points013: 0, points014: 0, points015: 0,
          points016: 0, points017: 0, points018: 0, points019: 0, points020: 0
        })
      } else {
        this.user.next(null);
      }
    });

    this.loadUser();
      // this.loggedIn = new BehaviorSubject<boolean>(false);
      // this.isLoggedInGuard = false;

  } // end constructor------------------------------------------------

  getUser(): Observable<User | null>{
    return this.user.asObservable();
    // console.log(this.user);
  }

  async creatUserProfile(user: User){
    await this.afs.collection('users').doc(user.uid).set(user).catch(error => {
      console.error("Error creating user document: ", error);
    });
  }

  register(username: string, email: string, password: string){
    this.afAuth.createUserWithEmailAndPassword(email, password).then(logRef => {
      const user: User = {
        uid: logRef.user.uid,
        email: logRef.user.email,
        userName: username,
        points001: 0, points002: 0, points003: 0, points004: 0, points005: 0,
        points006: 0, points007: 0, points008: 0, points009: 0, points010: 0,
        points011: 0, points012: 0, points013: 0, points014: 0, points015: 0,
        points016: 0, points017: 0, points018: 0, points019: 0, points020: 0
      };
      this.creatUserProfile(user);
      this.toastr.success('Registration Successfull');
      this.toastr.success('Please do not forget your password. There is currently no password reset options');
      this.router.navigate(['/home']);
    }).catch(error => {
      this.toastr.error('Registration Failed');
      this.router.navigate(['/registration']);
    });
  }

  loginEmail(username: string, email: string, password: string){
    // console.log(email, password);
    return this.afAuth.signInWithEmailAndPassword(email, password).then(logRef => {
      const user: User = {
        uid: logRef.user.uid,
        email: logRef.user.email,
        userName: logRef.user.email,
        points001: 0, points002: 0, points003: 0, points004: 0, points005: 0,
        points006: 0, points007: 0, points008: 0, points009: 0, points010: 0,
        points011: 0, points012: 0, points013: 0, points014: 0, points015: 0,
        points016: 0, points017: 0, points018: 0, points019: 0, points020: 0
      };
      // this.creatUserProfile(user);
      // Set the login expiration time to 6 hour from now
      const expiresAt = new Date().getTime() + (6 * 60 * 60 * 1000);
      localStorage.setItem('expires_at', JSON.stringify(expiresAt));

      // this.loadUser();???
      this.loggedIn.next(true);
      this.isLoggedInGuard = true;

      this.router.navigate(['/home']);
      this.toastr.success('Sign in Successfull');
    }).catch(error => {
      this.toastr.error('Sign in Failed');
    });
  }

  loadUser() {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');

    if (new Date().getTime() > expiresAt) {
      // The login has expired
      this.logOut();
    } else {
      // The login is still valid
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        if (user && user.email) {
          this.loggedIn.next(true);
          this.isLoggedInGuard = true;
        }
      }
    }

    this.afAuth.authState.subscribe(user => {
      // Set the login expiration time to 1 hour from now
      const expiresAt = new Date().getTime() + (1 * 60 * 60 * 1000);
      localStorage.setItem('expires_at', JSON.stringify(expiresAt));

      localStorage.setItem('user', JSON.stringify(user));
    });
  }


  logOut(){
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('expires_at');
      localStorage.removeItem('user');
      localStorage.removeItem('expires_at');

      // this.loggedIn.next(false);
      // this.isLoggedInGuard = false;

      // this.router.navigate(['/login']);
      this.toastr.success('You are signed out');
    });
  }

  isLoggedIn(){
    return this.loggedIn.asObservable();
  }

  // registration(email: string, password: string)
  // registration(email: string, password: string){
  //   this.afAuth.createUserWithEmailAndPassword(email, password).then(logRef => {
  //     this.toastr.success('Registration Successfull');
  //     this.router.navigate(['/login']);
  //   }).catch(error => {
  //     this.toastr.error(error);
  //     this.router.navigate(['/registration']);
  //   }
  //   );
  // }

}
