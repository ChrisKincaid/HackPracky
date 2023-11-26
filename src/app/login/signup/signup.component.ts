import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: NgForm | undefined;

  @ViewChild('signupNgForm') signupNgForm: NgForm | undefined;

constructor(private authService: AuthService) { }

  ngOnInit(): void {
}


onSubmit(formValue: any){
  this.authService.register(formValue.username, formValue.email, formValue.password);
  // console.log(formValue);
}

get passwordsMatch(): boolean {
  if (!this.signupNgForm || !this.signupNgForm.controls['password'] || !this.signupNgForm.controls['confirmPassword']) {
    return false; // Handle the case where signupForm is not assigned yet
  }

  const password = this.signupNgForm.controls['password'].value;
  const confirmPassword = this.signupNgForm.controls['confirmPassword'].value;
  return password === confirmPassword;
}

}
