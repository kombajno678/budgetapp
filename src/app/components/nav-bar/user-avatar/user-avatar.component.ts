import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Globals } from 'src/app/Globals';
import { BudgetService } from 'src/app/services/budget/budget.service';
import { UserService } from 'src/app/services/budget/user.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent implements OnInit {

  constructor(public userService: UserService,public auth: AuthService, public budget: BudgetService) { }

  ngOnInit(): void {
  }

  loginWithRedirect() {
    this.auth.loginWithPopup().subscribe(r => {
      console.log('after login');
      this.userService.afterLogin();
      this.userService.user$.asObservable().subscribe(u =>{
        if(u){
          let last = new Date(u.last_generated_operations_at);
          if (Globals.daysDifference(new Date(), last) >= 1) {
            console.log('afterLogin => generateOperations');
            this.budget.generateOperations();
          }
        }
      });
    });
  }


  // testToken() {
  //   this.budget.testToken().subscribe(r => console.log(r));
  // }

  logout() {
    this.userService.onLogout();
    this.auth.logout({ returnTo: '' });
  }


}
