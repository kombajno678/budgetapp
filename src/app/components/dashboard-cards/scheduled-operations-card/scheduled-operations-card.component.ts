import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Globals } from 'src/app/Globals';
import { PredictionPoint } from 'src/app/models/internal/PredictionPoint';
import { BudgetService } from 'src/app/services/budget/budget.service';
import { ScheduledOperationsService } from 'src/app/services/budget/scheduled-operations.service';

@Component({
  selector: 'app-scheduled-operations-card',
  templateUrl: './scheduled-operations-card.component.html',
  styleUrls: ['./scheduled-operations-card.component.scss']
})
export class ScheduledOperationsCardComponent implements OnInit {
  operations = [];

  

  futurePredictionPoints$: BehaviorSubject<PredictionPoint[]>;

  compareDates = Globals.compareDates;


  link = {
    title: 'Next scheduled operations',
    url: '/scheduledoperations',
    icon: 'event',
    loginRequired: true,
  }
  constructor(
    private scheduledOperationsService: ScheduledOperationsService,
    private budget: BudgetService
  ) {
    this.futurePredictionPoints$ = new BehaviorSubject<PredictionPoint[]>(null);

    let today = new Date();
    let nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    let nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);




    this.budget.generatePredictionsBetweenDates(today, nextWeek).subscribe(fps => {
      if (fps) {
        fps = fps.filter(fp => fp.operations && fp.operations.length > 0);
        fps.sort((a, b) => {
          return a.date.getTime() - b.date.getTime();
        });
        //console.log('FUTURE OPERATIONS : ', fps);
        fps.forEach(fp => {
          if(fp.operations.find(op => !op.scheduled_operation)){
            console.warn(fp)
          }
        })
        this.futurePredictionPoints$.next(fps);
      }else{
        this.futurePredictionPoints$.next(null);
      }
    })



  }

  ngOnInit(): void {
  }

}
