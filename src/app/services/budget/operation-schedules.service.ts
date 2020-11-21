import { Injectable } from '@angular/core';
import { ResourceServiceInterface } from './ResourceServiceInterface';
import { OperationSchedule } from 'src/app/models/OperationSchedule';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperationSchedulesService implements ResourceServiceInterface<OperationSchedule> {

  private url: string = (environment.apiUrl.endsWith('/') ? environment.apiUrl.slice(0, environment.apiUrl.length - 1) : environment.apiUrl);

  path: string = this.url + '/users/0/schedules';

  public operationSchedules: BehaviorSubject<OperationSchedule[]>;

  constructor(private http: HttpClient) {
    this.operationSchedules = new BehaviorSubject<OperationSchedule[]>(null);
    this.refreshResource();


  }

  refreshResource() {

    this.http.get<OperationSchedule[]>(this.path).pipe(
      tap(_ => this.log(this.path)),
      catchError(this.handleError<any>(this.path, null)),
    ).subscribe(result => {
      this.operationSchedules.next(result);
    })

  }


  getAll() {

    return this.operationSchedules.asObservable();
  }

  get(id: number) {
    return this.http.get<OperationSchedule>(this.path + '/' + id).pipe(
      tap(_ => this.log(this.path)),
      catchError(this.handleError<any>(this.path, null)),
    );
  }

  delete(object: OperationSchedule) {
    return this.http.delete<OperationSchedule>(this.path + '/' + object.id).pipe(
      tap(_ => { this.log(this.path); this.refreshResource(); }),
      catchError(this.handleError<any>(this.path, null)),
    )
  }

  update(object: OperationSchedule) {
    return this.http.put<OperationSchedule>(this.path + '/' + object.id, object).pipe(
      tap(_ => { this.log(this.path); this.refreshResource(); }),
      catchError(this.handleError<any>(this.path, null)),
    );
  }

  create(object: OperationSchedule) {
    return this.http.post<OperationSchedule>(this.path, object).pipe(
      tap(_ => { this.log(this.path); this.refreshResource(); }),
      catchError(this.handleError<any>(this.path, null)),
    );
  }






  private log(msg: string) {
    console.log('operationSchedulesService> ' + msg);
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
