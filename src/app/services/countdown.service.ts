import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountdownService {
  private countdownSubject = new BehaviorSubject<string>('00:00:00');
  countdown$: Observable<string> = this.countdownSubject.asObservable();
  intervalId:  number | undefined;

  constructor() { }

  startCountdown(hours: number, minutes: number): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
    const now = new Date();
    const endTime = new Date(now.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000);

    this.intervalId = window.setInterval(() => {
      const now = new Date();
      const remainingTime = endTime.getTime() - now.getTime();

      if (remainingTime <= 0) {
        window.clearInterval(this.intervalId);
        this.countdownSubject.next("00:00:00");
      } else {
        const hours   = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        this.countdownSubject.next(`${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`);
      }
    }, 1000);
  }

  stopCountdown(): void {
    console.log('Countdown should have stopped');
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
