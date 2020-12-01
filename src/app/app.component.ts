import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ChartOptions } from 'chart.js';
import { ThemeService } from 'ng2-charts';
import { environment } from 'src/environments/environment';
import { User } from './models/User';
import { BudgetService } from './services/budget/budget.service';
import { NavigationEnd, Router } from "@angular/router"

type Theme = 'light-theme' | 'dark-theme';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'budgetapp';
  isDarkTheme = JSON.parse(localStorage.getItem('isDarkTheme'));
  isHandsetLayout: boolean = false;


  user: User = null;

  animatedBg: boolean = false;




  private _selectedTheme: Theme = 'light-theme';
  public get selectedTheme() {
    return this._selectedTheme;
  }
  public set selectedTheme(value) {
    this._selectedTheme = value;
    let overrides: ChartOptions;
    if (this.selectedTheme === 'dark-theme') {
      overrides = {
        legend: {
          labels: { fontColor: 'white' }
        },
        scales: {
          xAxes: [{
            ticks: { fontColor: 'white' },
            gridLines: { color: 'rgba(255,255,255,0.1)' }
          }],
          yAxes: [{
            ticks: { fontColor: 'white' },
            gridLines: { color: 'rgba(255,255,255,0.1)' }
          }]
        }
      };
    } else {
      overrides = {};
    }
    this.themeService.setColorschemesOptions(overrides);
  }




  constructor(
    public auth: AuthService,
    public breakpointObserver: BreakpointObserver,
    private themeService: ThemeService,
    private budget: BudgetService,
    private router: Router
  ) {

    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      if (result.matches) {
        this.activateHandsetLayout();
      }
    });

    this.budget.user$.asObservable().subscribe(u => {
      this.user = u;
      console.log('received new user : ', u);
      if (u) {
        if (!u.last_generated_operations_at) {
          // beep boop, alert, new user has logged in
          console.log('redirect to quick start');
          this.router.navigate(['/quickstart'])

        }
      }
    })

    if (this.isDarkTheme) {
      this.setCurrentTheme('dark-theme');
    } else {
      this.setCurrentTheme('light-theme');

    }


    this.router.events.subscribe(event => {
      //NavigationEnd 
      if (event instanceof NavigationEnd) {
        console.log('router : ', event);

        if (event.url == '/') {
          //is on home page
          this.animatedBg = true;
        } else {
          this.animatedBg = false;

        }



      }
    });







    this.budget.afterLogin();



  }
  setCurrentTheme(theme: Theme) {
    this.selectedTheme = theme;
  }

  ngOnInit() {

  }


  // getToken() {
  //   this.auth.getAccessTokenSilently({ ignoreCache: true, audience: environment.auth.audience }).subscribe(token => {
  //     console.log('received token, ', token)
  //     localStorage.setItem('budgetapp-token', token);
  //   })
  // }



  changeTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('isDarkTheme', this.isDarkTheme);
  }

  activateHandsetLayout() {
    this.isHandsetLayout = true;
  }
}