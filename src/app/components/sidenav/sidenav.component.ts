import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Output()
  changeTheme = new EventEmitter();

  @Input()
  sidenav: MatSidenav;

  topLinks = [
    {
      title: 'Home',
      url: '/',
      icon: 'home',
      loginRequired: false,
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: 'person',
      loginRequired: true,


    }

  ];


  links = [

    {
      title: 'Predictions',
      url: '/predictions',
      icon: 'show_chart',
      loginRequired: true,
    },

    {
      title: 'Operations',
      url: '/operations',
      icon: 'money',
      loginRequired: true,


    },
    {
      title: 'Scheduled operations',
      url: '/scheduledoperations',
      icon: 'event',
      loginRequired: true,


    },
    {
      title: 'Fixed points',
      url: '/fixedpoints',
      icon: 'insights',
      loginRequired: true,


    },
  ];

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
  }
  handleChangeThemeClick() {
    this.changeTheme.emit();
    this.sidenav.close();
  }
  close() {
    this.sidenav.close();
  }

}
