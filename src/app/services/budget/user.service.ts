import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError, finalize, first, map, share, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { User } from 'src/app/models/User';
import { Globals } from 'src/app/Globals';
import { AuthService } from '@auth0/auth0-angular';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user$: ReplaySubject<User> = new ReplaySubject<User>(1);
  public user: User = null;


  constructor(
    private http: HttpClient,
    public auth: AuthService) {
    this.user$.subscribe(u => this.user = u);
  }




  testToken() {
    let path = environment.apiUrl + '/testtoken';

    return this.http.get<any>(path).pipe(
      tap(_ => this.log('BudgetService > ' + path)),

      catchError(this.handleError<any>(path, null))
    )
  }


  onLogout() {
    localStorage.removeItem('budgetapp-token');
    localStorage.removeItem('user');
    this.user$.next(null);
  }

  afterLogin() {
    this.auth.getAccessTokenSilently({ ignoreCache: true, audience: environment.auth.audience }).subscribe(token => {
      console.log('received token, ', token)
      localStorage.setItem('budgetapp-token', token);
      this.getUser().subscribe(u => {
        localStorage.setItem('budgetapp-user', JSON.stringify(u));
        this.user$.next(u);
      });
    })
  }

  getUser(): Observable<User> {
    let path = environment.apiUrl + '/users/0';
    return this.http.get<User>(path).pipe(
      tap(_ => this.log('BudgetService > ' + path)),
      catchError(this.handleError<any>(path, null))
    );
  }
  updateUser(newUser) {
    let path = environment.apiUrl + '/users/0';

    return this.http.put<User>(path, newUser).pipe(
      tap(_ => {
        this.log('BudgetService > ' + path);
        this.user = newUser;
        this.user$.next(this.user);
      }),
      catchError(this.handleError<any>(path, null))
    );

  }



  private log(msg: string) {
    console.log('UserService> ' + msg);
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }





}
