import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LooneyLoginService } from 'src/app/services/looney-login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  constructor(  private authService: AuthService,
                public looneyLoginService: LooneyLoginService) { }

  ngOnInit(): void {

    }

    onSubmit(formValue: any){
      this.authService.loginEmail(formValue.username, formValue.email, formValue.password);
    }

}
