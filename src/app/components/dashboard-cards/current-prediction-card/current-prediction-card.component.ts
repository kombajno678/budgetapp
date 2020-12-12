import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { PredictionPoint } from 'src/app/models/internal/PredictionPoint';
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


  predictions: PredictionPoint[] = [];
  predictions$: BehaviorSubject<PredictionPoint[]>;


  today: Date;
  nextMonth: Date;
  threeMonths: Date;

  predictionsLoaded$: BehaviorSubject<PredictionPoint[]>;
  todaysPrediction$: BehaviorSubject<PredictionPoint>;
  nextMonthPrediction$: BehaviorSubject<PredictionPoint>;
  threeMonthsPrediction$: BehaviorSubject<PredictionPoint>;


  latestFixedPoint$: BehaviorSubject<FixedPoint>;

  displayValue = Globals.displayValue;




  constructor(
    private budgetService: BudgetService,
    private fixedPointService: FixedPointsService,
    private operationsService: BudgetOperationService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    //this.predictions$ = new BehaviorSubject<PredictionPoint[]>(null);

    this.predictionsLoaded$ = new BehaviorSubject<PredictionPoint[]>(null);

    this.todaysPrediction$ = new BehaviorSubject<PredictionPoint>(null);
    this.nextMonthPrediction$ = new BehaviorSubject<PredictionPoint>(null);
    this.threeMonthsPrediction$ = new BehaviorSubject<PredictionPoint>(null);

    this.latestFixedPoint$ = new BehaviorSubject<FixedPoint>(null);


    this.today = new Date();

    this.nextMonth = new Date();
    this.nextMonth.setMonth(this.nextMonth.getMonth() + 1);

    this.threeMonths = new Date();
    this.threeMonths.setMonth(this.threeMonths.getMonth() + 3);


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

    this.fixedPointService.getLatest().subscribe(r => {
      this.latestFixedPoint$.next(r);
    })

    this.predictionsLoaded$.next(null);
    combineLatest([
      this.budgetService.generatePredictionForDate(this.today),
      this.budgetService.generatePredictionForDate(this.nextMonth),
      this.budgetService.generatePredictionForDate(this.threeMonths)
    ]).subscribe(r => {
      this.todaysPrediction$.next(r[0]);
      this.nextMonthPrediction$.next(r[1]);
      this.threeMonthsPrediction$.next(r[2]);
      this.predictionsLoaded$.next(r);
    })




  }



}
