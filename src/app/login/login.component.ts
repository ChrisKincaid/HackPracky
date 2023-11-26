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
                private looneyLoginService: LooneyLoginService) { }

  ngOnInit(): void {
    console.log('Here it is', this.looneyLoginService.generateHashStrings());

    }

    onSubmit(formValue: any){
      this.authService.loginEmail(formValue.username, formValue.email, formValue.password);
      // console.log(formValue);
    }

}
