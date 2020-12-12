import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError, finalize, first, map, share, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { BudgetOperation } from 'src/app/models/BudgetOperation';
import { FixedPointsService } from './fixed-points.service';
import { ScheduledOperationsService } from './scheduled-operations.service';
import { BudgetOperationService } from './budget-operation.service';
import { ScheduleType } from 'src/app/models/internal/ScheduleType';
import { User } from 'src/app/models/User';
import { Globals } from 'src/app/Globals';
import { PredicionPoint } from 'src/app/models/internal/PredictionPoint';
import { AuthService } from '@auth0/auth0-angular';
import { ScheduledBudgetOperation } from 'src/app/models/ScheduledBudgetOperation';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {


  public user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private user: User = null;


  constructor(
    private http: HttpClient,

    public auth: AuthService,

    private fixedPointsService: FixedPointsService,
    private operationsService: BudgetOperationService,
    private scheduledOperations: ScheduledOperationsService,
  ) {
    this.user$.subscribe(u => this.user = u);

  }



  //random helpers
  getDaysInRange = function (startDate: Date, endDate: Date) {
    let daysRange = [];
    for (var d = new Date(startDate); d <= endDate; d.setDate(d.getUTCDate() + 1)) {
      d.setUTCHours(0, 0, 0, 0);
      daysRange.push(new Date(d));
    }
    return daysRange;
  }
  compareDates(d1: Date, d2: Date) {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  }







  upload(formData): Observable<any> {
    let path = environment.apiUrl + '/upload';

    return this.http.post<any>(path, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }





  testToken() {
    let path = environment.apiUrl + '/testtoken';

    return this.http.get<any>(path).pipe(
      tap(_ => this.log(path)),
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
        localStorage.setItem('user', JSON.stringify(u));
        this.user$.next(u);

        let last = new Date(u.last_generated_operations_at);
        if (Globals.daysDifference(new Date(), last) >= 1) {
          this.generateOperations();
        }




      });

    })
  }

  getUser(): Observable<User> {
    let path = environment.apiUrl + '/users/0';
    return this.http.get<User>(path).pipe(
      catchError(this.handleError<any>(path, null))
    );
  }
  updateUser() {
    let path = environment.apiUrl + '/users/0';
    return this.http.put<User>(path, this.user).pipe(
      catchError(this.handleError<any>(path, null))
    );

  }





  predictions$: Subject<PredicionPoint[]>;
  generatePredictionsBetweenDates(start: Date, end: Date): Observable<PredicionPoint[]> {
    console.log('GENERATOR ionvoked ', start, end);

    if (!this.predictions$) {
      this.predictions$ = new Subject<PredicionPoint[]>();
    }
    console.log('GENERATOR generating days range ');
    let daysRange = Globals.getDaysInRange(start, end);
    console.log('GENERATOR got days range ', daysRange.length);

    combineLatest([
      this.fixedPointsService.getAll(),
      this.operationsService.getAll(),
      this.scheduledOperations.getAll(),

    ]).subscribe(r => {
      if (r.every(x => x)) {
        console.log('GENERATOR START ');

        let predictions = daysRange.map(p => new PredicionPoint(p, 0));
        let fixedPoints = r[0];
        let operations = r[1];

        fixedPoints = fixedPoints.filter(fp => fp.when <= end);
        operations = operations.filter(op => op.when >= start && op.when <= end);

        fixedPoints.forEach(fp => {
          let f = predictions.find(p => Globals.compareDates(p.date, fp.when));
          if (f) f.fixedPoint = fp;
        });

        predictions.forEach(p => {
          p.operations = operations.filter(op => Globals.compareDates(p.date, op.when));
        })




        let today = new Date();
        if (end > today) {
          let scheduledOps = r[2];
          //let schedules = r[3];
          //consider futur operations
          let futureOperations = [];

          //scheduledOps.forEach(so => so.schedule = schedules.find(s => s.id === so.schedule_id));


          daysRange.filter(d => d > today).forEach(d => {
            scheduledOps.forEach(so => {
              if (ScheduledBudgetOperation.matchSceduleWithDate(so, d)) {
                futureOperations.push(new BudgetOperation(so.name, so.value, d, so.id));
              }
            })
          });


          futureOperations.forEach(op => {
            predictions.find(p => Globals.compareDates(p.date, op.when)).operations.push(op);
          });

        }


        let firstDayValue = null
        if (!predictions[0].fixedPoint) {
          //find fixed point before start
          let sorted = fixedPoints.sort((a, b) => b.when.getTime() - a.when.getTime()); // desc
          let lastFp = sorted.find(f => f.when < start);
          if (lastFp) {
            console.log('lastFp = ', lastFp);
            let toSum = r[1].filter(op => op.when >= lastFp.when && op.when <= start);
            let diff = toSum.length > 0 ? toSum.map(op => op.value).reduce((p, c, ci, a) => p = p + c) : 0;
            firstDayValue = lastFp.exact_value + diff;
          } else {
            firstDayValue = 0;
          }
          predictions[0].value = firstDayValue;
          predictions[0].delta = 0;
        }

        for (let i = (firstDayValue ? 1 : 0); i < predictions.length; i++) {
          predictions[i].delta = predictions[i].operations.length > 0 ? predictions[i].operations.map(op => op.value).reduce((p, c, i, a) => p = p + c) : 0;
          predictions[i].value = (i > 0 ? predictions[i - 1].value : 0) + predictions[i].delta;
          if (predictions[i].fixedPoint) {
            predictions[i].value = predictions[i].fixedPoint.exact_value;
          }
        }
        console.log('GENERATOR NEXT ', predictions.length);
        this.predictions$.next(predictions);
        //this.predictions$.complete();
      }
    })

    console.log('GENERATOR RETURN ', this.predictions$);
    return this.predictions$.asObservable();

  }



  checkIfNeedToGenerateOperations(): Observable<number> {
    //check when was last time operations were generated

    let subject = new ReplaySubject<number>();


    let whenLast: Date = this.user.last_generated_operations_at;

    this.fixedPointsService.getLatest().subscribe(fpl => {

      //never, new user
      if (whenLast == null) {
        whenLast = new Date(fpl.when);
      }




      if (Globals.compareDates(new Date(), whenLast)) {
        //today, no need to generate again
        subject.next(0);
        return subject.asObservable();
      }




      //check how many new operations to add between last generated date and now
      this.generateListOfOperationsToAdd(whenLast).subscribe(ops => {
        if (ops && ops.length > 0) {
          console.log('ye, i need to generate thoose ', ops.length, ' operations');
          subject.next(ops.length);

        }
      });




    });





    return subject.asObservable();

  }



  generateListOfOperationsToAdd(since: Date): Observable<BudgetOperation[]> {



    let operationsToAdd: BudgetOperation[] = [];
    let subject = new ReplaySubject<BudgetOperation[]>();



    let days: Date[] = this.getDaysInRange(since, new Date());
    if (!days || days.length == 0) {
      //today, no need to generate again
      subject.next(operationsToAdd);
      subject.complete();
      return subject.asObservable();
    }
    //get all active scheduled operations 

    this.scheduledOperations.getAllOnce().subscribe(sos => {
      if (!sos || sos.length == 0) return;
      sos = sos.filter(so => so.active && !so.hidden);
      //this.schedulesService.getAllOnce().subscribe(schedules => {
      //if (!schedules || schedules.length == 0) return;
      //console.log('schedules : ', schedules);
      //sos.forEach(so => so.schedule = schedules.find(s => s.id === so.schedule_id));
      //sos = sos.filter(so => so.schedule);
      // TODO : date filter in API
      this.operationsService.getAllOnce().subscribe(operations => {
        operations = operations.filter(operation => operation.scheduled_operation_id && operation.when > since);
        //iterate throught days and match scheduled operations 
        days.forEach(d => {
          sos.forEach(so => {
            if (ScheduledBudgetOperation.matchSceduleWithDate(so, d)) {
              //proceed to check if operation from this schedule alredy exists
              if (!operations.find(op => this.compareDates(op.when, d) && op.scheduled_operation_id === so.id)) {
                operationsToAdd.push(new BudgetOperation(so.name, so.value, d, so.id));
              }
            }
          })
        })


        subject.next(operationsToAdd);
        subject.complete();


      })
      //})
    })



    return subject.asObservable();

  }

  generateOperations() {
    //determine date range
    //  from ?? maybe last fixed point
    //  to today


    let operationsToAdd: BudgetOperation[] = [];

    //get last fixed point

    this.fixedPointsService.getAllOnce().subscribe(fps => {
      if (!fps || fps.length == 0) {
        return;
      }
      //
      //find latest
      let latestFixedPoint = null;
      fps.forEach(fp => {
        if (!latestFixedPoint) {
          latestFixedPoint = fp;
        } else {
          //if fp date newer than latestFixedPoint date then replace
          if (fp.when > latestFixedPoint.when) {
            latestFixedPoint = fp;
          }
        }
      })

      //got latest fp => latestFixedPoint

      let days: Date[] = this.getDaysInRange(latestFixedPoint.when, new Date());
      if (!days || days.length == 0) {
        return;
      }


      //get all active scheduled operations 

      this.scheduledOperations.getAllOnce().subscribe(sos => {
        if (!sos || sos.length == 0) return;
        sos = sos.filter(so => so.active && !so.hidden);
        //this.schedulesService.getAllOnce().subscribe(schedules => {
        //if (!schedules || schedules.length == 0) return;
        //console.log('schedules : ', schedules);
        //sos.forEach(so => so.schedule = schedules.find(s => s.id === so.schedule_id));
        //sos = sos.filter(so => so.schedule);

        this.operationsService.getAllOnce().subscribe(operations => {
          //if (!operations || operations.length == 0) return;
          operations = operations.filter(operation => operation.scheduled_operation_id && operation.when > latestFixedPoint.when);

          //iterate throught days and match scheduled operations 
          console.log('iterating through ' + days.length + ' days ...');
          days.forEach(d => {
            //let thisDaysOperations = operations.filter(operation => operation.when.getTime() === d.getTime());

            sos.forEach(so => {
              let scheduleMatches: boolean = ScheduledBudgetOperation.matchSceduleWithDate(so, d);
              if (scheduleMatches) {
                //proceed to check if operation from this schedule alredy exists
                if (operations.find(op => this.compareDates(op.when, d) && op.scheduled_operation_id === so.id)) {
                  //no need, already exists
                  //console.log(d, so, 'already exists');
                } else {
                  //console.log('operationsToAdd = ' + operationsToAdd.length);
                  operationsToAdd.push(new BudgetOperation(so.name, so.value, d, so.id));

                }
              } else {
                //console.log(d, so, ' schedule not match');
              }

            })
          })

          //gone through all days, now add operations
          console.log('execcuting operationsToAdd = ' + operationsToAdd.length);



          this.operationsService.createMany(operationsToAdd).subscribe(r => {
            if (r) {
              console.log('generator: created ', operationsToAdd.length);
              this.user.last_generated_operations_at = new Date();
              this.updateUser().subscribe(r => {
                console.log('last_generated_operations_at updated');
              });

            } else {
              console.error('generator:  error ')
            };
          })
        })
        //})
      })
    })
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
