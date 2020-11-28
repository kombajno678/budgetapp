import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { PredicionPoint } from 'src/app/models/internal/PredictionPoint';
import { BudgetOperationService } from 'src/app/services/budget/budget-operation.service';
import { FixedPointsService } from 'src/app/services/budget/fixed-points.service';
import { Globals } from 'src/app/Globals';
import { FixedPoint } from 'src/app/models/FixedPoint';
import { CreateNewFixedPointDialogComponent } from '../../dialogs/create-new-fixed-point-dialog/create-new-fixed-point-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BudgetService } from 'src/app/services/budget/budget.service';


@Component({
  selector: 'app-current-prediction-card',
  templateUrl: './current-prediction-card.component.html',
  styleUrls: ['./current-prediction-card.component.scss']
})
export class CurrentPredictionCardComponent implements OnInit, AfterViewInit {


  predictions: PredicionPoint[] = [];
  predictions$: BehaviorSubject<PredicionPoint[]>;


  todaysPrediction$: BehaviorSubject<PredicionPoint>;
  latestFixedPoint$: BehaviorSubject<FixedPoint>;



  constructor(
    private budgetService: BudgetService,
    private fixedPointService: FixedPointsService,
    private operationsService: BudgetOperationService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.predictions$ = new BehaviorSubject<PredicionPoint[]>(null);
    this.todaysPrediction$ = new BehaviorSubject<PredicionPoint>(null);
    this.latestFixedPoint$ = new BehaviorSubject<FixedPoint>(null);

  }

  ngAfterViewInit(): void {
    this.generate();

  }

  addFixedPoint() {
    //open dialog for creating new operation
    let dialogRef = this.dialog.open(CreateNewFixedPointDialogComponent, { width: '100%' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let new_fixedPoint: FixedPoint = result;
        this.fixedPointService.create(new_fixedPoint).subscribe(r => {
          console.log('result od add new_fixedPoint = ', r);
        })
      }
    })
  }





  generate() {

    let endDate = new Date();
    //from last fixed point
    this.fixedPointService.getLatest().subscribe(r => {
      let latestFixedPoint = r;
      this.latestFixedPoint$.next(r);
      let startDate = new Date(latestFixedPoint.when);

      this.budgetService.generatePredictionsBetweenDates(startDate, endDate).subscribe(r => {

        this.predictions = r;
        this.predictions$.next(this.predictions);
        let tp = this.predictions.find(p => Globals.compareDates(p.date, endDate));
        //console.log({ tp });
        this.todaysPrediction$.next(tp);
      });
    })
  }



}
