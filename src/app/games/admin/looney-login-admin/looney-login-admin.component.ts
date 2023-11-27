import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { CountdownService } from 'src/app/services/countdown.service';


@Component({
  selector: 'app-looney-login-admin',
  templateUrl: './looney-login-admin.component.html',
  styleUrls: ['./looney-login-admin.component.css']
})
export class LooneyLoginAdminComponent implements OnInit {
  // countdown = '';
  // hours = 0;
  // minutes = 0;

  // constructor(private countdownService: CountdownService) { }
  constructor() { }

  ngOnInit(): void {
    // this.countdownService.countdown$.subscribe(countdown => {
    //   this.countdown = countdown;
    // });

    // this.countdownService.startCountdown(23, 59);
  }

  // startCountdown(): void {
  //   this.countdownService.startCountdown(this.hours, this.minutes);
  //   console.log('Start countdown', this.hours, this.minutes);
  // }

  // stopCountdown(): void {
  //   this.countdownService.stopCountdown();
  //   console.log('Stop countdown');
  // }

}
