import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, ContentChildren, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ChartOptions } from 'chart.js';
import { ThemeService } from 'ng2-charts';
import { environment } from 'src/environments/environment';
import { User } from './models/User';
import { BudgetService } from './services/budget/budget.service';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router"
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Globals } from './Globals';
import { UserService } from './services/budget/user.service';
import { BudgetOperationService } from './services/budget/budget-operation.service';
import { ScheduledOperationsService } from './services/budget/scheduled-operations.service';
import { combineLatest } from 'rxjs';
import { FixedPointsService } from './services/budget/fixed-points.service';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { Location } from '@angular/common';


import { PredictionChartComponent } from './components/charts/predictions/prediction-chart/prediction-chart.component';






@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'budgetapp';
  isDarkTheme = JSON.parse(localStorage.getItem('isDarkTheme'));
  isHandsetLayout: boolean = false;


  user: User = null;

  animatedBg: boolean = false;

  @ViewChild(MatSidenav)
  matDrawer;


  @ContentChildren(PredictionChartComponent)
  predictionCharts: QueryList<PredictionChartComponent>;


  sidenavMode: string = 'side'





  mySubscription;

  
 
  constructor(
    public auth: AuthService,
    public breakpointObserver: BreakpointObserver,
    private budget: BudgetService,
    private userService: UserService,
    private router: Router,private activatedRoute: ActivatedRoute,
    private snack: MatSnackBar,
    private operationsService: BudgetOperationService,
    private scheduledService: ScheduledOperationsService,
    private fixedPointsService: FixedPointsService,
    private location: Location

  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
     this.mySubscription = this.router.events.subscribe((event) => {
       if (event instanceof NavigationEnd) {
          // Trick the Router into believing it's last link wasn't previously loaded
          this.router.navigated = false;
       }
     }); 

    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      if (result.matches) {
        console.log('ACTIVATING HANDSET LAYOUT');
        this.matDrawer?.close();
        this.sidenavMode = 'over';
      } else {
        //desktop layout
        console.log('ACTIVATING DESKTOP LAYOUT');
        this.matDrawer?.open();
        this.sidenavMode = 'side';

      }
    });






    this.setAnimatedBgIfHomePage();



    this.userService.afterLogin();
    this.userService.user$.asObservable().subscribe(u => {
      if (u) {
        let last = new Date(u.last_generated_operations_at);
        if (Globals.daysDifference(new Date(), last) >= 1) {
          console.log('afterLogin => generateOperations');
          this.budget.generateOperations();
        }
      }
    });




  }




  ngOnInit() {

    this.redirectToQuickStartIfNewUser();

  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    //this.matDrawer.disableClose = true;

  }
  ngOnDestroy(){
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }


  setAnimatedBgIfHomePage() {

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

  }



  redirectToQuickStartIfNewUser() {

    console.log('redirectToQuickStartIfNewUser');

    this.fixedPointsService.getAll().subscribe(r => {
      console.log('redirectToQuickStartIfNewUser result : ', r);

      if (r && r.length == 0) {
        console.log('redirectToQuickStartIfNewUser redirecting ... ');
        this.router.navigate(['/quickstart'])
      }
    })


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
    this.userService.emitThemeChange();


    let temp = this.location.path();
    console.log('navigateByUrl', temp);
    this.router.navigateByUrl(temp, { skipLocationChange: true }).then(() => {
      this.router.navigate([temp]);
    });
  }

  activateHandsetLayout() {
    this.isHandsetLayout = true;
  }
}