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
          admin: false,
          points001: 0,     points002: 0,     points003: 0,     points004: 0,     points005: 0,
          points006: 0,     points007: 0,     points008: 0,     points009: 0,     points010: 0,
          points011: 0,     points012: 0,     points013: 0,     points014: 0,     points015: 0,
          points016: 0,     points017: 0,     points018: 0,     points019: 0,     points020: 0,
          points001Best: 0, points002Best: 0, points003Best: 0, points004Best: 0, points005Best: 0,
          points006Best: 0, points007Best: 0, points008Best: 0, points009Best: 0, points010Best: 0,
          points011Best: 0, points012Best: 0, points013Best: 0, points014Best: 0, points015Best: 0,
          points016Best: 0, points017Best: 0, points018Best: 0, points019Best: 0, points020Best: 0
        })
      } else {
        this.user.next(null);
      }
    });

    this.loadUser();

  } // end constructor------------------------------------------------

  getUser(): Observable<User | null>{
    return this.user.asObservable();
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
        admin: false,
        points001: 0,     points002: 0,     points003: 0,     points004: 0,     points005: 0,
        points006: 0,     points007: 0,     points008: 0,     points009: 0,     points010: 0,
        points011: 0,     points012: 0,     points013: 0,     points014: 0,     points015: 0,
        points016: 0,     points017: 0,     points018: 0,     points019: 0,     points020: 0,
        points001Best: 0, points002Best: 0, points003Best: 0, points004Best: 0, points005Best: 0,
        points006Best: 0, points007Best: 0, points008Best: 0, points009Best: 0, points010Best: 0,
        points011Best: 0, points012Best: 0, points013Best: 0, points014Best: 0, points015Best: 0,
        points016Best: 0, points017Best: 0, points018Best: 0, points019Best: 0, points020Best: 0
      };
      this.creatUserProfile(user);
      this.toastr.success(  'Registration Successfull');
      this.toastr.success(  'Please do not forget your password.' +
                            'There is currently no password reset options');
      this.router.navigate(['/home']);
    }).catch(error => {
      this.toastr.error('Registration Failed');
      this.router.navigate(['/registration']);
    });
  }

  loginEmail(username: string, email: string, password: string){
    return this.afAuth.signInWithEmailAndPassword(email, password)

    .then(logRef => {
      const user: User = {
        uid: logRef.user.uid,
        email: logRef.user.email,
        userName: logRef.user.email,
        admin: false,
        points001: 0,     points002: 0,     points003: 0,     points004: 0,     points005: 0,
        points006: 0,     points007: 0,     points008: 0,     points009: 0,     points010: 0,
        points011: 0,     points012: 0,     points013: 0,     points014: 0,     points015: 0,
        points016: 0,     points017: 0,     points018: 0,     points019: 0,     points020: 0,
        points001Best: 0, points002Best: 0, points003Best: 0, points004Best: 0, points005Best: 0,
        points006Best: 0, points007Best: 0, points008Best: 0, points009Best: 0, points010Best: 0,
        points011Best: 0, points012Best: 0, points013Best: 0, points014Best: 0, points015Best: 0,
        points016Best: 0, points017Best: 0, points018Best: 0, points019Best: 0, points020Best: 0
      };
      // Set the login expiration time to 6 hour from login time
      const expiresAt = new Date().getTime() + (6 * 60 * 60 * 1000);
      localStorage.setItem('expires_at', JSON.stringify(expiresAt));

      this.loggedIn.next(true);
      this.isLoggedInGuard = true;

      this.router.navigate(['/home']);
      this.toastr.success('Sign in Successfull');
    }).catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        this.toastr.error('The email address is already in use by another account.');
      } else if (error.code === 'auth/invalid-email') {
        this.toastr.error('The email address is not valid.');
      } else if (error.code === 'auth/weak-password') {
        this.toastr.error('The password is too weak.');
      } else {
        this.toastr.error('Registration failed.');
      }
      this.router.navigate(['/registration']);
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

      this.toastr.success('You are signed out');
    });
  }

  isLoggedIn(){
    console.log('isLoggedInGuard: ', this.isLoggedInGuard);
    return this.loggedIn.asObservable();
  }
}
