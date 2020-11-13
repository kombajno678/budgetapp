import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent, CustomSnackbarComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';


import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { JwtModule } from '@auth0/angular-jwt';



import { MaterialModule } from './material/material.module';
import { environment as env } from '../environments/environment';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserAvatarComponent } from './components/nav-bar/user-avatar/user-avatar.component';

function tokenGetter() {
  return localStorage.getItem('budgetapp-token');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    NavBarComponent,
    SidenavComponent,
    CustomSnackbarComponent,
    UserAvatarComponent,

  ],
  entryComponents: [CustomSnackbarComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
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
          'https://dev-wkdk2hez.eu.auth0.com'],
        disallowedRoutes: [],

      }
    }),
    NgbModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
/*
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
  */
 // causes component to laod twice, dunno why