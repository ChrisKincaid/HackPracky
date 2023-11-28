import { Component, OnInit } from '@angular/core';
import { LooneyLoginService } from 'src/app/services/looney-login.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-looney-login-admin',
  templateUrl: './looney-login-admin.component.html',
  styleUrls: ['./looney-login-admin.component.css']
})
export class LooneyLoginAdminComponent implements OnInit {
  constructor(private looneyLoginService: LooneyLoginService,
              private userService: UserService,
              private toastr: ToastrService) { }

  ngOnInit(): void { }

  startGame(): void {
    this.looneyLoginService.startGame();
  };

  stopGame(): void {
    this.looneyLoginService.stopGame();
    this.userService.resetPoints('points001');
    this.toastr.success('Game ended and reset successfully.');
  };
}
