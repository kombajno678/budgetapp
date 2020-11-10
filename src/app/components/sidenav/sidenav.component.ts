import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Output()
  changeTheme = new EventEmitter();


  links = [
    {
      title: 'Home',
      url: '/',
      icon: 'home',
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: 'person',

    },
    {
      title: 'Budget',
      url: '/budget',
      icon: 'home',

    },
  ];

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
  }
  handleChangeThemeClick() {
    this.changeTheme.emit();
  }

}
