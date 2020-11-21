import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ScheduledBudgetOperation } from 'src/app/models/ScheduledBudgetOperation';
import { environment } from 'src/environments/environment';
import { ResourceService } from './ResourceService';
import { multicast } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScheduledOperationsService implements ResourceService<ScheduledBudgetOperation> {

  private url: string = (environment.apiUrl.endsWith('/') ? environment.apiUrl.slice(0, environment.apiUrl.length - 1) : environment.apiUrl);

  path: string = this.url + '/users/0/scheduled_operations';

  public scheduledOperations: BehaviorSubject<ScheduledBudgetOperation[]>;

  constructor(private http: HttpClient) {
    this.scheduledOperations = new BehaviorSubject<ScheduledBudgetOperation[]>(null);
    this.refreshResource();


  }

  refreshResource() {

    this.http.get<ScheduledBudgetOperation[]>(this.path).pipe(
      tap(_ => this.log(this.path)),
      catchError(this.handleError<any>(this.path, null)),
    ).subscribe(result => {
      this.scheduledOperations.next(result);
    })

  }


  getAll() {

    return this.scheduledOperations.asObservable();
  }

  get(id: number) {
    return this.http.get<ScheduledBudgetOperation>(this.path + '/' + id).pipe(
      tap(_ => this.log(this.path)),
      catchError(this.handleError<any>(this.path, null)),
    );
  }

  delete(object: ScheduledBudgetOperation) {
    return this.http.delete<ScheduledBudgetOperation>(this.path + '/' + object.id).pipe(
      tap(_ => { this.log(this.path); this.refreshResource(); }),
      catchError(this.handleError<any>(this.path, null)),
    )
  }

  update(object: ScheduledBudgetOperation) {
    return this.http.put<ScheduledBudgetOperation>(this.path + '/' + object.id, object).pipe(
      tap(_ => { this.log(this.path); this.refreshResource(); }),
      catchError(this.handleError<any>(this.path, null)),
    );
  }

  create(object: ScheduledBudgetOperation) {
    return this.http.post<ScheduledBudgetOperation>(this.path, object).pipe(
      tap(_ => { this.log(this.path); this.refreshResource(); }),
      catchError(this.handleError<any>(this.path, null)),
    );
  }






  private log(msg: string) {
    console.log('ScheduledOperationsService> ' + msg);
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
