import { Component, OnInit } from '@angular/core';
import { BudgetOperation } from 'src/app/models/BudgetOperation';
import { FixedPointsService } from 'src/app/services/budget/fixed-points.service';
import { BudgetOperationService } from 'src/app/services/budget/budget-operation.service';
import { PredicionPoint } from 'src/app/models/internal/PredictionPoint';
import { BehaviorSubject, combineLatest, forkJoin, merge, Observable, of } from 'rxjs';
import { Globals } from 'src/app/Globals';
import { BudgetService } from 'src/app/services/budget/budget.service';

@Component({
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.scss']
})
export class PredictionsComponent implements OnInit {


  predictions: PredicionPoint[] = [];
  predictions$: BehaviorSubject<PredicionPoint[]>;
  todaysPrediction$: BehaviorSubject<PredicionPoint>;


  constructor(
    private budgetService: BudgetService,
    private fixedPointService: FixedPointsService,
    private operationsService: BudgetOperationService
  ) { }

  ngOnInit(): void {
    this.predictions$ = new BehaviorSubject<PredicionPoint[]>(null);
    this.todaysPrediction$ = new BehaviorSubject<PredicionPoint>(null);

    this.generate();
  }



  generate() {

    let endDate = new Date();
    let startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 90);
    endDate.setDate(endDate.getDate() + 90);


    this.budgetService.generatePredictionsBetweenDates(startDate, endDate).subscribe(r => {

      this.predictions = r;
      this.predictions$.next(this.predictions);
      this.todaysPrediction$.next(this.predictions.find(p => Globals.compareDates(p.date, endDate)));
    });



  }

  getPredictions(): Observable<PredicionPoint[]> {

    return this.predictions$.asObservable();

  }

}
