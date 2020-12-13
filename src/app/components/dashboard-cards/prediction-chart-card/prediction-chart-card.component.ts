import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Globals } from 'src/app/Globals';
import { PredictionPoint } from 'src/app/models/internal/PredictionPoint';
import { BudgetService } from 'src/app/services/budget/budget.service';


export interface PredictionChartCardConfig {
  startDate: Date,
  endDate: Date,
  title: string
}


@Component({
  selector: 'app-prediction-chart-card',
  templateUrl: './prediction-chart-card.component.html',
  styleUrls: ['./prediction-chart-card.component.scss']
})
export class PredictionChartCardComponent implements OnInit {



  link = {
    title: 'Predictions',
    url: '/predictions',
    //icon: 'money',
    //loginRequired: true,
  }
  predictions$: BehaviorSubject<PredictionPoint[]>;

  selectedPP$: BehaviorSubject<PredictionPoint>;

  @Input()
  config: PredictionChartCardConfig;


  constructor(
    private budgetService: BudgetService,
    private router: Router
  ) {

    this.predictions$ = new BehaviorSubject<PredictionPoint[]>(null)
    this.selectedPP$ = new BehaviorSubject<PredictionPoint>(null)

  }

  redirect() {

    this.router.navigate([this.link.url], { queryParams: { start: this.config.startDate.toISOString().substr(0, 10), end: this.config.endDate.toISOString().substr(0, 10) } });

  }

  onDayClicked(day: Date) {
    console.log('received day click event');

    this.predictions$.subscribe(pps => {
      this.selectedPP$.next(pps.find(pp => Globals.compareDates(pp.date, day)))
    })



  }



  ngOnInit(): void {

    this.budgetService.generatePredictionsBetweenDates(this.config.startDate, this.config.endDate).subscribe(
      (r) => {
        this.predictions$.next(r);
      },
      (error) => {
        console.error('RECEIVED generatePredictionsBetweenDates error: ', error);
      },
      () => {
        console.log('RECEIVED generatePredictionsBetweenDates completed');
      }
    );



  }

}
