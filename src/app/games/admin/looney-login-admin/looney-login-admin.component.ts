import { Component, OnInit } from '@angular/core';
import { LooneyLoginService } from 'src/app/services/looney-login.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-looney-login-admin',
  templateUrl: './looney-login-admin.component.html',
  styleUrls: ['./looney-login-admin.component.css']
})
export class LooneyLoginAdminComponent implements OnInit {
  gameStatus: boolean;
  constructor(public looneyLoginService: LooneyLoginService,
              private userService: UserService,
              private toastr: ToastrService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.looneyLoginService.gameStatus$.subscribe(gameStatus => {
      this.gameStatus = gameStatus;
      this.cdr.detectChanges();

      console.log('gameStatus: ', this.gameStatus);
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
