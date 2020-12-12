import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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

  @Input()
  config: PredictionChartCardConfig;


  constructor(private budgetService: BudgetService) {

    this.predictions$ = new BehaviorSubject<PredictionPoint[]>(null)

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
