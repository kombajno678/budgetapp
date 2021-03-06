import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, merge, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AbstractResource } from 'src/app/models/AbstractResource';
import { environment } from 'src/environments/environment';
import { BudgetService } from './budget.service';
import { ResourceServiceInterface } from './ResourceServiceInterface';
import { UserService } from './user.service';
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

  public resource$: BehaviorSubject<T[]>;
  private resource: T[];
  public mapWhenRefreshing = (resource) => resource;

  constructor(pathSuffix: string, customMap, public http: HttpClient, public userService:UserService) {
    this.pathSuffix = pathSuffix;
    if (!this.pathSuffix) {
      throw 'pathSuffix not sppecified';
    }
    this.path = this.url + this.pathSuffix;

    this.resource$ = new BehaviorSubject<T[]>(null);
    this.resource$.subscribe(r => {
      this.resource = r;
    })

    if (customMap) {
      this.mapWhenRefreshing = customMap;

    }

    this.userService.getUser().subscribe(user => {
      if(user){
        this.refreshResource();

      }
    })


  }

  refreshResource() {
    this.getAllOnce().subscribe(result => this.resource$.next(result))
  }



  getAll(): Observable<T[]> {
    if(!this.resource || this.resource.length == 0){
      this.refreshResource(); 
    }

    return this.resource$.asObservable();
  }

  getAllOnce(): Observable<T[]> {
    return this.http.get<T[]>(this.path).pipe(
      tap(_ => this.log(this.path)),
      map(this.mapWhenRefreshing),
      catchError(this.handleError<T[]>(this.path, null)),
    );
  }

  get(id: number) {
    return this.http.get<T>(this.path + '/' + id).pipe(
      tap(_ => this.log(this.path)),
      catchError(this.handleError<T>(this.path, null)),
    );
  }





  delete(object: T, refresh: boolean = true, log: boolean = true) {
    return this.http.delete<T>(this.path + '/' + object.id).pipe(
      tap(_ => {
        if (log) this.log(this.path);
        if (refresh) this.refreshResource();
      }),
      catchError(this.handleError<T>(this.path, null)),
    )
  }


  deleteMany(objects: T[], refresh: boolean = true, log: boolean = true) {

    let observableRequests = [];
    objects.forEach(o => {
      let x = this.http.delete<T>(this.path + '/' + o.id).pipe(
        tap(_ => {
          if (log) this.log(this.path);
          if (refresh) this.refreshResource();
        }),
        catchError(this.handleError<T[]>(this.path, null)),
      );
      observableRequests.push(x);
    });


    return forkJoin(observableRequests);


  }

  deleteAll(refresh: boolean = true, log: boolean = true): Observable<number> {
    return this.http.delete<any>(this.path + '/' + '0').pipe(
      tap(_ => {
        if (log) this.log(this.path);
        if (refresh) this.refreshResource();
      }),
      catchError(this.handleError<any>(this.path, null)),
    );
  }





  update(object: T, refresh: boolean = true, log: boolean = true) {
    return this.http.put<T>(this.path + '/' + object.id, object).pipe(
      tap(_ => {
        if (log) this.log(this.path);
        if (refresh) this.refreshResource();
      }),
      catchError(this.handleError<T>(this.path, null)),
    );
  }





  create(object: T, refresh: boolean = true, log: boolean = true): Observable<T> {
    return this.http.post<T>(this.path, object).pipe(
      tap(_ => {
        if (log) this.log(this.path);
        if (refresh) this.refreshResource();
      }),
      catchError(this.handleError<T>(this.path, null)),
    );
  }


  createMany(objects: T[], refresh: boolean = true, log: boolean = true): Observable<T[]> {
    return this.http.post<T[]>(this.path, objects).pipe(
      tap(_ => {
        if (log) this.log(this.path);
        if (refresh) this.refreshResource();
      }),
      catchError(this.handleError<T[]>(this.path, null)),
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
