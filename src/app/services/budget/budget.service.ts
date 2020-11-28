import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, finalize, map, share, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { BudgetOperation } from 'src/app/models/BudgetOperation';
import { FixedPointsService } from './fixed-points.service';
import { ScheduledOperationsService } from './scheduled-operations.service';
import { BudgetOperationService } from './budget-operation.service';
import { OperationSchedulesService } from './operation-schedules.service';
import { ScheduleType } from 'src/app/models/internal/ScheduleType';

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
          console.log('schedules : ', schedules);
          sos.forEach(so => so.schedule = schedules.find(s => s.id === so.schedule_id));
          sos = sos.filter(so => so.schedule);

          this.operationsService.getAllOnce().subscribe(operations => {
            //if (!operations || operations.length == 0) return;
            operations = operations.filter(operation => operation.scheduled_operation_id && operation.when > latestFixedPoint.when);

            //iterate throught days and match scheduled operations 
            console.log('iterating through ' + days.length + ' days ...');
            days.forEach(d => {
              //let thisDaysOperations = operations.filter(operation => operation.when.getTime() === d.getTime());
              let scheduleMatches: boolean = false;

              sos.forEach(so => {
                console.log('so.schedule.scheduleType = ', so.schedule.scheduleType);
                switch (so.schedule.scheduleType) {
                  case ScheduleType.daily:
                    //scheduled operation is on daily schedule, 
                    scheduleMatches = true;
                    break;
                  case ScheduleType.weekly:
                    //check day of week
                    scheduleMatches = (so.schedule.day_of_week.includes(d.getDay()));
                    if (!scheduleMatches) {
                      console.log(d.getDay(), 'not in ', so.schedule.day_of_week)
                    }
                    break;
                  case ScheduleType.monthly:
                    //check day of month
                    scheduleMatches = (so.schedule.day_of_month.includes(d.getDate()));
                    if (!scheduleMatches) {
                      console.log(d.getDate(), 'not in ', so.schedule.day_of_month)
                    }
                    break;
                  case ScheduleType.annually:
                    //check day of month and month
                    scheduleMatches = (so.schedule.day_of_month.includes(d.getDate()) && so.schedule.month.includes(d.getMonth()));
                    if (!scheduleMatches) {
                      console.log(d.getDate(), 'not in ', so.schedule.day_of_month)
                      console.log(d.getMonth(), 'not in ', so.schedule.month)
                    }
                    break;
                  default:
                    break;
                }
                if (scheduleMatches) {
                  //proceed to check if operation from this schedule alredy exists
                  if (operations.find(op => this.compareDates(op.when, d) && op.scheduled_operation_id === so.id)) {
                    //no need, already exists
                    console.log(d, so, 'already exists');
                  } else {
                    console.log('operationsToAdd = ' + operationsToAdd.length);
                    operationsToAdd.push(new BudgetOperation(so.name, so.value, d, so.id));

                  }
                } else {
                  console.log(d, so, ' schedule not match');
                }

              })
            })

            //gone through all days, now add operations
            console.log('execcuting operationsToAdd = ' + operationsToAdd.length);
            operationsToAdd.forEach(newOp => {
              this.operationsService.create(newOp, false).subscribe(r => {
                if (r) {
                  console.log('generator: created ', newOp)
                } else {
                  console.error('generator:  error ', newOp)
                }
              });
            })
            console.log('done');
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
