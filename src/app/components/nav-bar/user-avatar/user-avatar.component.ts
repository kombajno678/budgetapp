import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { BudgetService } from 'src/app/services/budget/budget.service';
@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent implements OnInit {

  constructor(public auth: AuthService, public budget: BudgetService) { }

  ngOnInit(): void {
  }

  loginWithRedirect() {
    this.auth.loginWithPopup();
  }

  testToken() {
    this.budget.testToken().subscribe(r => console.log(r));
  }

  logout() {
    this.auth.logout({ returnTo: '' });
  }




}
