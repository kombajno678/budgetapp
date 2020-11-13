import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { BudgetOperation } from 'src/app/models/BudgetOperation';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private url: string = environment.apiUrl;


  constructor(private http: HttpClient) { }

  getOperations(): Observable<BudgetOperation[]> {
    let path = this.url + '/operations';

    return this.http.get<BudgetOperation[]>(path).pipe(
      tap(_ => this.log(path)),
      catchError(this.handleError<BudgetOperation[]>(path, null))
    )
  }

  getOperation(id: number): Observable<BudgetOperation> {
    let path = this.url + '/operations/' + id;

    return this.http.get<BudgetOperation>(path).pipe(
      tap(_ => this.log(path)),
      catchError(this.handleError<BudgetOperation>(path, null))
    )
  }

  addOperation(operation: BudgetOperation): Observable<BudgetOperation> {
    let path = this.url + '/operations';

    return this.http.post<BudgetOperation>(path, operation).pipe(
      tap(_ => this.log(path)),
      catchError(this.handleError<BudgetOperation>(path, null))
    )
  }

  updateOperation(operation: BudgetOperation): Observable<BudgetOperation> {
    let path = this.url + '/operations/' + operation.id;

    return this.http.put<BudgetOperation>(path, operation).pipe(
      tap(_ => this.log(path)),
      catchError(this.handleError<BudgetOperation>(path, null))
    )
  }

  deleteOperation(operation: BudgetOperation): Observable<BudgetOperation> {
    let path = this.url + '/operations/' + operation.id;

    return this.http.delete<BudgetOperation>(path).pipe(
      tap(_ => this.log(path)),
      catchError(this.handleError<BudgetOperation>(path, null))
    )
  }

  tokenTest() {
    let path = this.url + '/testtoken';

    return this.http.get<any>(path).pipe(
      tap(_ => this.log(path)),
      catchError(this.handleError<any>(path, null))
    )
  }



  private log(msg: string) {
    console.log('BudgetService> ' + msg);
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
