import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { BudgetService } from 'src/app/services/budget/budget.service';
import { UserService } from 'src/app/services/budget/user.service';

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


  predictionsLinks = [{
    title: 'Predictions',
    url: '/predictions',
    icon: 'show_chart',
    loginRequired: true,
    disabled: false,
  },
  {
    title: 'When will i have ...',
    url: '/whenwill',
    icon: 'event',
    loginRequired: true,
    disabled: false,
  },
  {
    title: 'How much money will i have ...',
    url: '/howmuchwill',
    icon: 'event',
    loginRequired: true,
    disabled: false,
  },
  ];


  resourcesLinks = [


    {
      title: 'Operations',
      url: '/operations',
      icon: 'money',
      loginRequired: true,
      disabled: false,


    },
    {
      title: 'Categories',
      url: '/categories',
      icon: 'category',
      loginRequired: true,
      disabled: false,


    },
    {
      title: 'Scheduled operations',
      url: '/scheduledoperations',
      icon: 'event',
      loginRequired: true,
      disabled: false,


    },
    {
      title: 'Fixed points',
      url: '/fixedpoints',
      icon: 'insights',
      loginRequired: true,
      disabled: false,


    },

  ];

  bottomLinks = [
    {
      title: 'Quick start',
      url: '/quickstart',
      icon: 'help',
      loginRequired: true,
      disabled: false,


    },
    {
      title: 'Upload',
      url: '/upload',
      icon: 'upload',
      loginRequired: true,
      disabled: false,


    },
  ];

  constructor(public auth: AuthService, public userService: UserService, private router:Router) { }

  ngOnInit(): void {
  }
  handleChangeThemeClick() {
    this.changeTheme.emit();
    this.sidenav.close();
  }
  close() {
    this.sidenav.close();
  }

  logout() {
    this.userService.onLogout();
    this.auth.logout({ returnTo: '' });
  }

  redirectToProfile(){
    this.router.navigateByUrl('/profile');
  }


}
