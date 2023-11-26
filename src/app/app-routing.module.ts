import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './login/signup/signup.component';
import { LooneyLoginComponent } from './games/looney-login/looney-login.component';

const routes: Routes = [
  // { path: '', redirectTo: '/home2', pathMatch: 'full'},
  // { path: '**', component: HomeComponent},
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {path: 'looney-login', component: LooneyLoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
