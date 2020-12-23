import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError, finalize, first, map, share, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { BudgetOperation } from 'src/app/models/BudgetOperation';
import { FixedPointsService } from './fixed-points.service';
import { ScheduledOperationsService } from './scheduled-operations.service';
import { BudgetOperationService } from './budget-operation.service';
import { ScheduleType } from 'src/app/models/internal/ScheduleType';
import { User } from 'src/app/models/User';
import { Globals } from 'src/app/Globals';
import { PredictionPoint } from 'src/app/models/internal/PredictionPoint';
import { AuthService } from '@auth0/auth0-angular';
import { ScheduledBudgetOperation } from 'src/app/models/ScheduledBudgetOperation';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  verbose: boolean = true;//true//false;




  constructor(
    private http: HttpClient,

    private userService: UserService,


    public auth: AuthService,

    private fixedPointsService: FixedPointsService,
    private operationsService: BudgetOperationService,
    private scheduledOperations: ScheduledOperationsService,
  ) {

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


  public i = 0;
  private findValueRecursive(dateA: Date, step: number, directionForward: boolean, valueToFind:number): Observable<Date> {
    this.i++;
    if (this.verbose)console.log(this.i, ' > someF(',dateA, step, directionForward, valueToFind, ' )');
    let result: ReplaySubject<Date> = new ReplaySubject<Date>(1);
    //check value at today
    /*
    let dateA = new Date(startingDate);
    if (directionForward) {
      dateA.setDate(dateA.getDate() + (i * step));
    } else {
      dateA.setDate(dateA.getDate() - (i * step));
    }
    */
   
    let dateB = new Date(dateA);
    if (directionForward) {
      dateB.setDate(dateB.getDate() + step);
    } else {
      dateB.setDate(dateB.getDate() - step);
    }

    //let valueA = await this.generatePredictionForDate(dateA).toPromise();
    //let valueB = await this.generatePredictionForDate(dateB).toPromise();

    combineLatest([
      this.generatePredictionForDate(dateA),
      this.generatePredictionForDate(dateB)
    ]).subscribe(r => {
      if (r.every(x => x)) {
        let valueA = r[0];
        let valueB = r[1];

        if (this.verbose)console.log(this.i + ' > checking value at ' + dateA.toISOString() + '  : ' + valueA.value);
        if (this.verbose)console.log(this.i + ' > checking value at ' + dateB.toISOString() + '  : ' + valueB.value);
        //console.log(this.i + ' > ', (valueB.value - valueA.value > 0) ? 'rising' : 'decreasing');


        // if money is rising and x < both values, return lower date
        if(valueB.value - valueA.value > 0 && (valueToFind < valueB.value && valueToFind < valueA.value)){
          result.next(dateA < dateB ? dateA : dateB );
          if (this.verbose)console.log(this.i + ' > money is rising and x < both values, return lower date');
          return;
        }

        // if money is decreasing and x > both values, return lower date
        if(valueB.value - valueA.value < 0 && (valueToFind > valueB.value && valueToFind > valueA.value)){
          result.next(dateA < dateB ? dateA : dateB );
          if (this.verbose)console.log(this.i + ' > money is decreasing and x > both values, return lower date');

          return;
        }



        //x between prev and next
        if ((valueToFind > valueA.value && valueToFind < valueB.value) || ((valueToFind < valueA.value && valueToFind > valueB.value))) {
          if(step < 2){
            
            if(Math.abs(valueToFind - valueA.value) < Math.abs(valueToFind - valueB.value) ){
              
              result.next(dateA);
            }else{
              result.next(dateB);

            }


          }else{
            if (this.verbose)console.log(this.i + ' > step = step / 2; directionForward = !directionForward');
            step = Math.floor(step / 2);
            directionForward = !directionForward;
            this.findValueRecursive(dateB, step, directionForward, valueToFind).subscribe(r => {
              if(r){
                result.next(r);
              }
            });
          }
          
        } else {
          step = Math.floor(step * 1.25);
          if (this.verbose)console.log(this.i + ' > step = step * 2');

          this.findValueRecursive(dateB, step, directionForward, valueToFind).subscribe(r => {
            if(r){
              result.next(r);
            }
          });
        }

      }
    })

    return result;





  }

  findDateWithValue(valueToFind: number): Observable<Date> {
    this.i = 0;
    let result = new ReplaySubject<Date>(1);
    let step = 32;
    let directionForward: boolean = true;
    let startingDate = new Date();
    startingDate.setUTCHours(12, 0, 0, 0);

    this.generatePredictionForDate(startingDate).subscribe(r => {
      if(r){
        if(valueToFind < r.value ){
          //console.log('you already have this money');
          result.next(startingDate);
          
        }else{
           
          this.findValueRecursive(startingDate, step, directionForward, valueToFind).subscribe(r => {
            result.next(r);
          });
        }
      }
    })
    return result; 

    
    
  }



  generatePredictionForDate(date: Date): Observable<PredictionPoint> {
    if (this.verbose)console.log('GENERATOR: asked for prediction at : ', date.toISOString());
    
    let ob: ReplaySubject<PredictionPoint> = new ReplaySubject<PredictionPoint>(1);
    this.generatePredictionsBetweenDates(date, date).subscribe(r => {
      //
      if (this.verbose) console.log('GENERATOR: ', date.toISOString(), ' => ',r[r.length - 1]);
      ob.next(r[r.length - 1]);
    })
    return ob.asObservable();

  }


  //predictions$: Subject<PredictionPoint[]>;
  generatePredictionsBetweenDates(start: Date, end: Date): Observable<PredictionPoint[]> {
    if (this.verbose) console.log('GENERATOR ionvoked ', start.toISOString(), end.toISOString());
    let predictions$ = new ReplaySubject<PredictionPoint[]>(2);
    /*
        if (!this.predictions$) {
          this.predictions$ = new Subject<PredictionPoint[]>();
        }
        */
    if (this.verbose) console.log('GENERATOR generating days range ');
    let daysRange = Globals.getDaysInRange(start, end);
    if (this.verbose) console.log('GENERATOR got days range ', daysRange.length);

    combineLatest([
      this.fixedPointsService.getAll(),
      this.operationsService.getAll(),
      this.scheduledOperations.getAll(),

    ]).subscribe(r => {
      if (r.every(x => x)) {
        if (this.verbose) console.log('GENERATOR START ');

        let predictions = daysRange.map(p => new PredictionPoint(p, 0));
        let fixedPoints = r[0];
        let operations = r[1];
        let scheduledOps = r[2];

        fixedPoints = fixedPoints.filter(fp => fp.when <= end);
        operations = operations.filter(op => /*op.when >= start && */op.when <= end);

        fixedPoints.forEach(fp => {
          let f = predictions.find(p => Globals.compareDates(p.date, fp.when));
          if (f) f.fixedPoint = fp;
        });

        predictions.forEach(p => {
          p.operations = operations.filter(op => Globals.compareDates(p.date, op.when));
          //
        })




        let today = new Date();
        if (end > today) {

          //let schedules = r[3];
          //consider futur operations
          let futureOperations = [];

          //scheduledOps.forEach(so => so.schedule = schedules.find(s => s.id === so.schedule_id));


          daysRange.filter(d => d > today).forEach(d => {
            scheduledOps.forEach(so => {
              if (ScheduledBudgetOperation.matchSceduleWithDate(so, d)) {
                let newOp = new BudgetOperation(so.name, so.value, d, so.id);
                newOp.scheduled_operation = so;
                newOp.scheduled_operation_id = so.id;
                futureOperations.push(newOp);
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
            if (this.verbose) console.log('lastFp = ', lastFp);
            let toSum = r[1].filter(op => op.when >= lastFp.when && op.when <= start);
            let diff = toSum.length > 0 ? toSum.map(op => op.value).reduce((p, c, ci, a) => p = p + c) : 0;
            firstDayValue = 0;
            //if future, also check scheduled operations
            let today = new Date();
            today.setUTCHours(12, 0, 0, 0);
            if (start > today) {

              //in range (today, start)
              let range = Globals.getDaysInRange(today, start);
              range.forEach(d => {
                r[2].forEach(so => {
                  if (ScheduledBudgetOperation.matchSceduleWithDate(so, d)) {
                    //futureOperations.push(new BudgetOperation(so.name, so.value, d, so.id));
                    firstDayValue += (so.value);
                  }
                })
              });


            }
            firstDayValue += (lastFp.exact_value + diff);
          } else {
            firstDayValue = 0;
          }
          if (this.verbose) console.log('firstDayValue = ', firstDayValue, predictions[0].date.toISOString());
          predictions[0].value = firstDayValue;
          predictions[0].delta = 0;

        }

        for (let i = (firstDayValue ? 1 : 0); i < predictions.length; i++) {
          predictions[i].delta = predictions[i].operations.length > 0 ? predictions[i].operations.map(op => op.value).reduce((p, c, i, a) => p = p + c) : 0;
          predictions[i].value = (i > 0 ? predictions[i - 1].value : 0) + predictions[i].delta;
          if (predictions[i].fixedPoint) {
            predictions[i].value = predictions[i].fixedPoint.exact_value;
          }
          if (predictions[i].date > today) {
            //attach scheduled operation to any operation in the future, bc bugs might happend otherwise
            predictions[i].operations.forEach(op => {
              op.scheduled_operation = scheduledOps.find(so => so.id === op.scheduled_operation_id);
            })
          }
        }
        if (this.verbose) console.log('GENERATOR NEXT ', predictions.length);
        predictions$.next(predictions);
        //this.predictions$.complete();
      }
    })

    if (this.verbose) console.log('GENERATOR RETURN ', predictions$);
    //predictions$.complete();
    return predictions$.asObservable();

  }



  checkIfNeedToGenerateOperations(): Observable<number> {
    //check when was last time operations were generated

    let subject = new ReplaySubject<number>();

    this.userService.user$.asObservable().subscribe(user => {


      let whenLast: Date = user.last_generated_operations_at;

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
            if (this.verbose) console.log('ye, i need to generate thoose ', ops.length, ' operations');
            subject.next(ops.length);

          }
        });
      });
    })



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
          if (this.verbose) console.log('iterating through ' + days.length + ' days ...');
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
                  let temp: BudgetOperation = new BudgetOperation(so.name, so.value, d, so.id);
                  temp.scheduled_operation = so;
                  temp.scheduled_operation_id = so.id;
                  operationsToAdd.push(temp);

                }
              } else {
                //console.log(d, so, ' schedule not match');
              }

            })
          })

          //gone through all days, now add operations
          if (this.verbose) console.log('execcuting operationsToAdd = ' + operationsToAdd.length);



          this.operationsService.createMany(operationsToAdd).subscribe(r => {
            if (r) {
              if (this.verbose) console.log('generator: created ', operationsToAdd.length);


              this.userService.user.last_generated_operations_at = new Date();
              this.userService.updateUser(this.userService.user).subscribe(r => {
                if (this.verbose) console.log('last_generated_operations_at updated');
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
