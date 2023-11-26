import { Component, OnInit } from '@angular/core';
import { LooneyLoginService } from 'src/app/services/looney-login.service';

@Component({
  selector: 'app-looney-login',
  templateUrl: './looney-login.component.html',
  styleUrls: ['./looney-login.component.css']
})
export class LooneyLoginComponent implements OnInit {

  constructor(private looneyLoginService: LooneyLoginService) { }

  ngOnInit(): void {
    console.log('Here it is', this.looneyLoginService.generateHashStrings());
  }
  // looneyLoginService: any;

  generateHashStrings(): void {
    // this.looneyLoginService.generateHashStrings();
  }

}
