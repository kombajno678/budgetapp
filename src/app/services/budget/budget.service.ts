import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { catchError, finalize, map, share, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { BudgetOperation } from 'src/app/models/BudgetOperation';
import { FixedPointsService } from './fixed-points.service';
import { ScheduledOperationsService } from './scheduled-operations.service';
import { BudgetOperationService } from './budget-operation.service';
import { OperationSchedulesService } from './operation-schedules.service';
import { ScheduleType } from 'src/app/models/internal/ScheduleType';
import { OperationSchedule } from 'src/app/models/OperationSchedule';
import { Globals } from 'src/app/Globals';
import { PredicionPoint } from 'src/app/models/internal/PredictionPoint';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {


  constructor(
    private http: HttpClient,

    private fixedPointsService: FixedPointsService,
    private operationsService: BudgetOperationService,
    private scheduledOperations: ScheduledOperationsService,
    private schedulesService: OperationSchedulesService
  ) { }



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








  testToken() {
    let path = environment.apiUrl + '/testtoken';

    return this.http.get<any>(path).pipe(
      tap(_ => this.log(path)),
      catchError(this.handleError<any>(path, null))
    )
  }





  generatePredictionsBetweenDates(start: Date, end: Date): Observable<PredicionPoint[]> {

    let daysRange = Globals.getDaysInRange(start, end);
    let predictions = daysRange.map(p => new PredicionPoint(p, 0));
    let predictions$: Subject<PredicionPoint[]> = new Subject<PredicionPoint[]>();

    combineLatest([
      this.fixedPointsService.getAll(),
      this.operationsService.getAll()
    ]).subscribe(r => {
      if (r[0] && r[1]) {
        /*
        let fixedPoints = r[0];
        fixedPoints.forEach(fp => {
          predictions.filter(p => (p.date >= fp.when)).forEach(pp => pp.value = fp.exact_value);
          predictions.filter(p => Globals.compareDates(p.date, fp.when)).forEach(p => p.fixedPoint = fp);
        });
        let operations = r[1];
        operations.forEach(op => {
          predictions.filter(pr => (pr.date >= op.when)).forEach(pp => pp.value = pp.value + op.value);
          predictions.filter(p => Globals.compareDates(p.date, op.when)).forEach(p => p.operations.push(op));
        });
        for (let i = 1; i < predictions.length; i++) {
          predictions[i].delta = predictions[i].value - predictions[i - 1].value;
        }
        */
        let fixedPoints = r[0];
        let operations = r[1];

        fixedPoints = fixedPoints.filter(fp => fp.when >= start && fp.when <= end);
        operations = operations.filter(op => op.when >= start && op.when <= end);

        fixedPoints.forEach(fp => {
          predictions.find(p => Globals.compareDates(p.date, fp.when)).fixedPoint = fp;
        });

        operations.forEach(op => {
          predictions.find(p => Globals.compareDates(p.date, op.when)).operations.push(op);
        });



        for (let i = 0; i < predictions.length; i++) {



          predictions[i].delta = predictions[i].operations.length > 0 ? predictions[i].operations.map(op => op.value).reduce((p, c, i, a) => p = p + c) : 0;
          predictions[i].value = (i > 0 ? predictions[i - 1].value : 0) + predictions[i].delta;

          if (predictions[i].fixedPoint) {
            predictions[i].value = predictions[i].fixedPoint.exact_value;
          }

          /*
          if(i > 0){
            predictions[i].delta = predictions[i].value - predictions[i - 1].value;
          }
          */
        }


        predictions$.next(predictions);
      }
    })

    return predictions$.asObservable();

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
        this.schedulesService.getAllOnce().subscribe(schedules => {
          if (!schedules || schedules.length == 0) return;
          //console.log('schedules : ', schedules);
          sos.forEach(so => so.schedule = schedules.find(s => s.id === so.schedule_id));
          sos = sos.filter(so => so.schedule);

          this.operationsService.getAllOnce().subscribe(operations => {
            //if (!operations || operations.length == 0) return;
            operations = operations.filter(operation => operation.scheduled_operation_id && operation.when > latestFixedPoint.when);

            //iterate throught days and match scheduled operations 
            console.log('iterating through ' + days.length + ' days ...');
            days.forEach(d => {
              //let thisDaysOperations = operations.filter(operation => operation.when.getTime() === d.getTime());

              sos.forEach(so => {
                let scheduleMatches: boolean = OperationSchedule.matchSceduleWithDate(so.schedule, d);
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
                console.log('generator: created ', operationsToAdd.length)
              } else {
                console.error('generator:  error ')
              };
            })
          })
        })
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
