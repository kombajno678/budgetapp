import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  @Output()
  toggleMenu = new EventEmitter();



  user: any;
  isAuthenticated: boolean;

  constructor(public auth: AuthService,
    private router: Router) {
    this.auth.error$.subscribe(err => {
      console.error('auth error = ', err);
    });

    this.auth.isAuthenticated$.subscribe(isAuthenticated => {
      console.log('auth isAuthenticated = ', isAuthenticated);
      this.isAuthenticated = isAuthenticated;
    });

    this.auth.isLoading$.subscribe(loading => {
      console.log('auth isLoading = ', loading);
    });

    this.auth.user$.subscribe(user => {
      console.log('auth user = ', user);
      this.user = user;
    });


  }

  ngOnInit(): void {
    console.warn('init');
  }




  handleMenuButtonClick() {
    this.toggleMenu.emit();
  }

  redirectToHome(){

    this.router.navigateByUrl('/');

  }



}
