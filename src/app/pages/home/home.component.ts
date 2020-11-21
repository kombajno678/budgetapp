import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(public auth: AuthService) { }

  ngOnInit(): void {
  }

  onSignInClick() {
    this.auth.loginWithPopup();
  }
}
