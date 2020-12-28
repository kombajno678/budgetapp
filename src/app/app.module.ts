import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';


import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { JwtModule } from '@auth0/angular-jwt';



import { MaterialModule } from './material/material.module';
import { environment as env, environment } from '../environments/environment';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserAvatarComponent } from './components/nav-bar/user-avatar/user-avatar.component';
import { OperationsComponent } from './pages/operations/operations.component';
import { RecentOperationsTableComponent } from './components/tables/recent-operations-table/recent-operations-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CreateNewOperationDialogComponent } from './components/dialogs/create-new-operation-dialog/create-new-operation-dialog.component';
import { CreateNewScheduledOperationDialogComponent } from './components/dialogs/create-new-scheduled-operation-dialog/create-new-scheduled-operation-dialog.component';



import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { ScheduledOperationsComponent } from './pages/scheduled-operations/scheduled-operations.component';
import { FixedPointsComponent } from './pages/fixed-points/fixed-points.component';
import { CreateNewFixedPointDialogComponent } from './components/dialogs/create-new-fixed-point-dialog/create-new-fixed-point-dialog.component';
import { PredictionsComponent } from './pages/predictions/predictions.component';

import { ChartsModule } from 'ng2-charts';
import { PredictionChartComponent } from './components/charts/predictions/prediction-chart/prediction-chart.component';
import { FixedpointsChartComponent } from './components/charts/fixedpoints/fixedpoints-chart/fixedpoints-chart.component';
import { ScheduledOperationListElementComponent } from './components/list-elements/scheduled-operation-list-element/scheduled-operation-list-element.component';
import { OperationListElementComponent } from './components/list-elements/operation-list-element/operation-list-element.component';
import { OperationsCardComponent } from './components/dashboard-cards/operations-card/operations-card.component';
import { ScheduledOperationsCardComponent } from './components/dashboard-cards/scheduled-operations-card/scheduled-operations-card.component';
import { CurrentPredictionCardComponent } from './components/dashboard-cards/current-prediction-card/current-prediction-card.component';
import { QuickStartComponent } from './pages/quick-start/quick-start.component';
import { UploadComponent } from './pages/upload/upload.component';
import { LoadingSpinnerComponent } from './components/misc/loading-spinner/loading-spinner.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CategoryListElementComponent } from './components/list-elements/category-list-element/category-list-element.component';
import { CategoryDialogComponent } from './components/dialogs/category-dialog/category-dialog.component';
import { PredictionChartCardComponent } from './components/dashboard-cards/prediction-chart-card/prediction-chart-card.component';
import { UploadHelpDialogComponent } from './components/dialogs/upload-help-dialog/upload-help-dialog.component';
import { WhenWillComponent } from './pages/when-will/when-will.component';
import { HowMuchWillComponent } from './pages/how-much-will/how-much-will.component';
import { FixedPointListElementComponent } from './components/list-elements/fixed-point-list-element/fixed-point-list-element.component';

import { HighchartsChartModule } from 'highcharts-angular';


function tokenGetter(): string {
  return localStorage.getItem('budgetapp-token')
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    NavBarComponent,
    SidenavComponent,
    UserAvatarComponent,
    OperationsComponent,
    RecentOperationsTableComponent,
    CreateNewOperationDialogComponent,
    CreateNewScheduledOperationDialogComponent,
    ScheduledOperationsComponent,
    FixedPointsComponent,
    CreateNewFixedPointDialogComponent,
    PredictionsComponent,
    PredictionChartComponent,
    FixedpointsChartComponent,
    ScheduledOperationListElementComponent,
    OperationListElementComponent,
    OperationsCardComponent,
    ScheduledOperationsCardComponent,
    CurrentPredictionCardComponent,
    QuickStartComponent,
    UploadComponent,
    LoadingSpinnerComponent,
    CategoriesComponent,
    CategoryListElementComponent,
    CategoryDialogComponent,
    PredictionChartCardComponent,
    UploadHelpDialogComponent,
    WhenWillComponent,
    HowMuchWillComponent,
    FixedPointListElementComponent

  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    //GoogleChartsModule,
    ChartsModule,
    HighchartsChartModule,
    AuthModule.forRoot({
      ...env.auth,
      httpInterceptor: {
        ...env.httpInterceptor,
      },
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [
          'https://dev-wkdk2hez.eu.auth0.com', environment.apiUrl],
        disallowedRoutes: [],
        authScheme: "Bearer ",
        throwNoTokenError: true,
        skipWhenExpired: true,
      }
    }),
    NgbModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
/*
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
  */
 // causes component to laod twice, dunno why




