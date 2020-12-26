import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BudgetOperation } from 'src/app/models/BudgetOperation';
import { FixedPointsService } from 'src/app/services/budget/fixed-points.service';
import { BudgetOperationService } from 'src/app/services/budget/budget-operation.service';
import { PredictionPoint } from 'src/app/models/internal/PredictionPoint';
import { BehaviorSubject, combineLatest, forkJoin, merge, Observable, of } from 'rxjs';
import { Globals } from 'src/app/Globals';
import { BudgetService } from 'src/app/services/budget/budget.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { PredictionChartCardConfig } from 'src/app/components/dashboard-cards/prediction-chart-card/prediction-chart-card.component';

@Component({
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.scss']
})
export class PredictionsComponent implements OnInit, AfterViewInit {


  predictions: PredictionPoint[] = [];
  predictions$: BehaviorSubject<PredictionPoint[]>;

  config$: BehaviorSubject<PredictionChartCardConfig>;

  loading$: BehaviorSubject<boolean>;
  //todaysPrediction$: BehaviorSubject<PredictionPoint>;

  generatorSubscribtion: Observable<any>;
  selectedPP$: BehaviorSubject<PredictionPoint>;



  form: FormGroup;

  startDate: Date;
  endDate: Date;

  dateRangeDynamic: boolean = false;



  constructor(
    private budgetService: BudgetService,
    private fixedPointService: FixedPointsService,
    private operationsService: BudgetOperationService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.selectedPP$ = new BehaviorSubject<PredictionPoint>(null)


  }

  ngOnInit(): void {
    this.loading$ = new BehaviorSubject<boolean>(null);
    this.loading$.next(true);

    this.predictions$ = new BehaviorSubject<PredictionPoint[]>(null);
    this.config$ = new BehaviorSubject<PredictionChartCardConfig>(null);
    //this.todaysPrediction$ = new BehaviorSubject<PredictionPoint>(null);
    //this.config$.next({ title: 'haha' });

    this.form = this.fb.group({
      startDate: [moment(), { validators: [Validators.required], updateOn: 'blur' }],
      endDate: [moment(), { validators: [Validators.required], updateOn: 'blur' }]
    });
  }

  ngAfterViewInit() {


    this.route.queryParams.subscribe(params => {
      if (params['start'] && params['end']) {
        this.startDate = new Date(params['start']);
        this.endDate = new Date(params['end']);

        this.form.controls.startDate.setValue(params['start']);
        this.form.controls.endDate.setValue(params['end']);

      } else {
        this.setDateRageMonths();
      }
      this.generate();
    });



  }

  onDayClicked(day: Date) {
    console.log('received day click event');
    console.log('clicked day = ', day.toISOString().substr(0, 10));

    this.predictions$.subscribe(pps => {
      //console.log('pps = ', pps);

      this.selectedPP$.next(pps.find(pp => Globals.compareDates(pp.date, day)))
    })



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

  getPredictionsWhereDeltaNotZero(list: PredictionPoint[]) {
    return list.filter(p => p.delta !== 0)

  }



  setDateRageMonths() {
    //console.log('setDateRangeWeek');

    this.endDate = new Date();
    this.endDate.setUTCHours(12, 0, 0, 0);

    this.startDate = new Date(this.endDate);

    this.startDate.setMonth(this.startDate.getMonth() - 3);
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



  displayValue(number: number) {
    return number.toFixed(2);


  }
  generate() {
    this.loading$.next(true);
    console.log('predictions > generating ... , ', this.startDate, this.endDate);
    this.budgetService.generatePredictionsBetweenDates(this.startDate, this.endDate).subscribe(
      (r) => {
        if (r) {
          console.log('RECEIVED  generatePredictionsBetweenDates prediction for ', r.length, ' days');
          this.predictions = r;
          this.predictions$.next(this.predictions);
          this.loading$.next(false);
        }

      },
      (error) => {
        console.error('RECEIVED generatePredictionsBetweenDates error: ', error);
        this.loading$.next(false);
      },
      () => {
        console.log('RECEIVED generatePredictionsBetweenDates completed');
        this.loading$.next(false);
      }
    );

  }

  getPredictions(): Observable<PredictionPoint[]> {

    return this.predictions$.asObservable();

  }

}
