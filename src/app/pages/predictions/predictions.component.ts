import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BudgetOperation } from 'src/app/models/BudgetOperation';
import { FixedPointsService } from 'src/app/services/budget/fixed-points.service';
import { BudgetOperationService } from 'src/app/services/budget/budget-operation.service';
import { PredictionPoint } from 'src/app/models/internal/PredictionPoint';
import { BehaviorSubject, combineLatest, forkJoin, merge, Observable, of } from 'rxjs';
import { Globals } from 'src/app/Globals';
import { BudgetService } from 'src/app/services/budget/budget.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment, { Moment } from 'moment';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { PredictionChartCardConfig } from 'src/app/components/dashboard-cards/prediction-chart-card/prediction-chart-card.component';


export interface PredictionsGroup {
  predictions: PredictionPoint[],
  name: string,
  expensesSum: number,
  incomeSum: number,

  expensesSumMax: boolean,
  incomeSumMax: boolean,

  operations: number,


}
@Component({
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.scss']
})
export class PredictionsComponent implements OnInit, AfterViewInit {


  predictions: PredictionPoint[] = [];
  predictions$: BehaviorSubject<PredictionPoint[]>;

  groupedPredictions: PredictionsGroup[] = [];

  config$: BehaviorSubject<PredictionChartCardConfig>;

  loading$: BehaviorSubject<boolean>;
  //todaysPrediction$: BehaviorSubject<PredictionPoint>;

  generatorSubscribtion: Observable<any>;
  selectedPP$: BehaviorSubject<PredictionPoint>;



  form: FormGroup;

  startDate: Date;
  endDate: Date;

  dateRangeDynamic: boolean = false;

  summaryRangeType: string = 'month';




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
    let s: Moment = moment(this.form.controls.startDate.value);
    s.add(12, 'h');
    let e: Moment = moment(this.form.controls.endDate.value);
    e.add(24, 'h');
    this.startDate = s.toDate();
    this.endDate = e.toDate();
    this.generate();
  }



  onSummaryTypeChange(event: MatButtonToggleChange) {
    this.summaryRangeType = event.value;
    this.initGrouppedSummary();


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
    return Number(number.toFixed(2)).toLocaleString();
  }


  initGrouppedSummary() {


    //group predictions
    this.groupedPredictions = [];
    //find distinct months in predictions
    this.predictions.forEach(pp => {
      let m = moment(pp.date);
      let name: string = '';

      switch (this.summaryRangeType) {
        case 'year':
          name = '' + m.year()
          break;
        case 'quarter':
          name = '' + m.year() + '-' + m.quarter()
          break;
        case 'month':
          name = '' + (pp.date.toISOString().substr(0, 7));

          break;
        case 'week':

          name = '' + m.year() + '-' + m.week();
          break;
        case 'day':
          name = '' + m.year() + '-' + m.month() + '-' + m.date();

          break;
        default:
          break;
      }




      //console.log(name);

      let group = this.groupedPredictions.find(g => g.name === name);
      if (!group) {

        this.groupedPredictions.push({
          name: name,
          predictions: [pp],
          expensesSum: 0,
          incomeSum: 0,
          expensesSumMax: false,
          incomeSumMax: false,
          operations: 0

        });
        //console.log('pushed new group');
      } else {
        group.predictions.push(pp);
        //console.log('pushed pp to ', group);
      }
    });
    let expensesSumMax = 0;
    let incomeSumMax = 0;
    this.groupedPredictions.forEach(g => {
      g.expensesSum = 0;
      g.incomeSum = 0;
      g.predictions.forEach(pp => {
        pp.operations.forEach(op => {
          if (op.value >= 0) {
            g.incomeSum += op.value;
          } else {
            g.expensesSum += op.value;
          }
          g.operations++
        })
      });

      if (g.incomeSum > incomeSumMax) {
        incomeSumMax = g.incomeSum;
      }
      if (g.expensesSum < expensesSumMax) {
        expensesSumMax = g.expensesSum;
      }


    });
    this.groupedPredictions.forEach(g => {
      if (g.expensesSum <= expensesSumMax) {
        g.expensesSumMax = true;
      }
      if (g.incomeSum >= incomeSumMax) {
        g.incomeSumMax = true;
      }
    })



  }

  generate() {
    this.loading$.next(true);
    console.log('predictions > generating ... , ', this.form.controls.startDate.value, this.form.controls.endDate.value);
    console.log('predictions > generating ... , ', this.startDate, this.endDate);
    //this.startDate.setUTCHours(12, 0, 0, 0);
    //this.endDate.setUTCHours(12, 0, 0, 0);
    //console.log('predictions > generating ... , ', this.startDate, this.endDate);
    this.budgetService.generatePredictionsBetweenDates(this.startDate, this.endDate).subscribe(
      (r) => {
        if (r) {
          console.log('RECEIVED  generatePredictionsBetweenDates prediction for ', r.length, ' days');
          this.predictions = r;

          let config: PredictionChartCardConfig = {
            title: 'Predictions',
            delayOnUpdate: false,
            disableControls: false
          };

          this.initGrouppedSummary();

          this.predictions$.next(this.predictions);
          this.config$.next(config);

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
