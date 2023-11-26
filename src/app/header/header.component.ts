import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  user$: Observable<User | null>;

constructor(public authService: AuthService) {
  this.user$ = this.authService.getUser();
}

logOut() {
  this.authService.logOut();
}

}
