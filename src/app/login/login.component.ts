import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    }

    onSubmit(formValue: any){
      this.authService.loginEmail(formValue.username, formValue.email, formValue.password);
      // console.log(formValue);
    }

}
