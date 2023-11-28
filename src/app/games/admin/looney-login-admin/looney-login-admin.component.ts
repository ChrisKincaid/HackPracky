import { Component, OnInit } from '@angular/core';
import { LooneyLoginService } from 'src/app/services/looney-login.service';

@Component({
  selector: 'app-looney-login-admin',
  templateUrl: './looney-login-admin.component.html',
  styleUrls: ['./looney-login-admin.component.css']
})
export class LooneyLoginAdminComponent implements OnInit {
  constructor(private looneyLoginService: LooneyLoginService) { }

  ngOnInit(): void { }

  startGame(): void {
    this.looneyLoginService.generateHashStrings();
  };
}
