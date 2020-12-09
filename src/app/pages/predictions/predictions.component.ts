import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BudgetOperation } from 'src/app/models/BudgetOperation';
import { FixedPointsService } from 'src/app/services/budget/fixed-points.service';
import { BudgetOperationService } from 'src/app/services/budget/budget-operation.service';
import { PredicionPoint } from 'src/app/models/internal/PredictionPoint';
import { BehaviorSubject, combineLatest, forkJoin, merge, Observable, of } from 'rxjs';
import { Globals } from 'src/app/Globals';
import { BudgetService } from 'src/app/services/budget/budget.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { tap } from 'rxjs/operators';

@Component({
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.scss']
})
export class PredictionsComponent implements OnInit, AfterViewInit {


  predictions: PredicionPoint[] = [];
  predictions$: BehaviorSubject<PredicionPoint[]>;
  todaysPrediction$: BehaviorSubject<PredicionPoint>;

  generatorSubscribtion: Observable<any>;

  form: FormGroup;

  startDate: Date;
  endDate: Date;

  dateRangeDynamic: boolean = false;



  constructor(
    private budgetService: BudgetService,
    private fixedPointService: FixedPointsService,
    private operationsService: BudgetOperationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.predictions$ = new BehaviorSubject<PredicionPoint[]>(null);
    this.todaysPrediction$ = new BehaviorSubject<PredicionPoint>(null);
    this.form = this.fb.group({
      startDate: [moment(), { validators: [Validators.required], updateOn: 'blur' }],
      endDate: [moment(), { validators: [Validators.required], updateOn: 'blur' }]
    });
  }

  ngAfterViewInit() {

    this.setDateRageMonths();

    this.generate();

  }

  onFormSubmit() {
    this.startDate = this.form.controls.startDate.value.toDate();
    this.endDate = this.form.controls.endDate.value.toDate();
    this.generate();
  }



  onRangeTypeChange(event: MatButtonToggleChange) {
    switch (event.value) {
      case 'month':
        this.setDateRageMonth();
        this.generate();
        break;
      case 'months':
        this.setDateRageMonths();
        this.generate();
        break;
      default:
        break;
    }
  }



  setDateRageMonths() {
    //console.log('setDateRangeWeek');

    this.endDate = new Date();
    this.endDate.setUTCHours(12, 0, 0, 0);

    this.startDate = new Date(this.endDate);

    this.startDate.setMonth(this.startDate.getMonth() - 4);
    this.endDate.setMonth(this.endDate.getMonth() + 3);

    this.form.controls.endDate.setValue(this.endDate);
    this.form.controls.startDate.setValue(this.startDate);
  }
  setDateRageMonth() {
    //console.log('setDateRageMonth');


    this.endDate = new Date();
    this.endDate.setUTCHours(12, 0, 0, 0);

    this.startDate = new Date(this.endDate);

    this.startDate.setMonth(this.startDate.getMonth() - 1);
    this.endDate.setMonth(this.endDate.getMonth() + 1);

    this.form.controls.endDate.setValue(this.endDate);
    this.form.controls.startDate.setValue(this.startDate);
  }



  generate() {
    console.log('generating ... , ', this.startDate, this.endDate);
    this.budgetService.generatePredictionsBetweenDates(this.startDate, this.endDate).subscribe(
      (r) => {
        console.log('RECEIVED  generatePredictionsBetweenDates prediction for ', r.length, ' days');
        this.predictions = r;
        this.predictions$.next(this.predictions);
      },
      (error) => {
        console.error('RECEIVED generatePredictionsBetweenDates error: ', error);
      },
      () => {
        console.log('RECEIVED generatePredictionsBetweenDates completed');
      }
    );

  }

  getPredictions(): Observable<PredicionPoint[]> {

    return this.predictions$.asObservable();

  }

}
