import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AbstractResource } from 'src/app/models/AbstractResource';
import { environment } from 'src/environments/environment';
import { ResourceServiceInterface } from './ResourceServiceInterface';
/*
@Injectable({
  providedIn: 'root'
})
*/
export abstract class AbstractResourceService<T extends AbstractResource> implements ResourceServiceInterface<T>{

  private url: string = (environment.apiUrl.endsWith('/') ? environment.apiUrl.slice(0, environment.apiUrl.length - 1) : environment.apiUrl);

  path: string;

  //to override
  pathSuffix: string;

  public resource: BehaviorSubject<T[]>;

  constructor(pathSuffix: string, customMap, public http: HttpClient) {
    this.pathSuffix = pathSuffix;
    if (!this.pathSuffix) {
      throw 'pathSuffix not sppecified';
    }
    this.path = this.url + this.pathSuffix;

    this.resource = new BehaviorSubject<T[]>(null);
    if (customMap) {
      this.mapWhenRefreshing = customMap;

    }
    this.refreshResource();


  }

  refreshResource() {

    this.http.get<T[]>(this.path).pipe(
      tap(_ => this.log(this.path)),
      map(this.mapWhenRefreshing),
      catchError(this.handleError<any>(this.path, null)),
    ).subscribe(result => this.resource.next(result))

  }

  public mapWhenRefreshing = (resource) => { console.log('default map'); return resource };


  getAll() {

    return this.resource.asObservable();
  }

  get(id: number) {
    return this.http.get<T>(this.path + '/' + id).pipe(
      tap(_ => this.log(this.path)),
      catchError(this.handleError<any>(this.path, null)),
    );
  }

  delete(object: T) {
    return this.http.delete<T>(this.path + '/' + object.id).pipe(
      tap(_ => { this.log(this.path); this.refreshResource(); }),
      catchError(this.handleError<any>(this.path, null)),
    )
  }

  update(object: T) {
    return this.http.put<T>(this.path + '/' + object.id, object).pipe(
      tap(_ => { this.log(this.path); this.refreshResource(); }),
      catchError(this.handleError<any>(this.path, null)),
    );
  }

  create(object: T) {
    return this.http.post<T>(this.path, object).pipe(
      tap(_ => { this.log(this.path); this.refreshResource(); }),
      catchError(this.handleError<any>(this.path, null)),
    );
  }






  log(msg: string) {
    console.log('ResourceService> ' + msg);
  }
  handleError<T>(operation = 'operation', result?: T) {
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
