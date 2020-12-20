import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Globals } from 'src/app/Globals';
import { PredictionPoint } from 'src/app/models/internal/PredictionPoint';
import { BudgetService } from 'src/app/services/budget/budget.service';


export interface PredictionChartCardConfig {
  startDate?: Date,
  endDate?: Date,
  title: string,
  marks?: any[],
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
  config$: Observable<PredictionChartCardConfig>;

  localConfig:PredictionChartCardConfig;


  constructor(
    private budgetService: BudgetService,
    private router: Router
  ) {

    this.predictions$ = new BehaviorSubject<PredictionPoint[]>(null);
    this.selectedPP$ = new BehaviorSubject<PredictionPoint>(null);

    



    

  }

  redirect() {

    this.router.navigate([this.link.url], { queryParams: { start: this.localConfig.startDate.toISOString().substr(0, 10), end: this.localConfig.endDate.toISOString().substr(0, 10) } });

  }

  onDayClicked(day: Date) {
    console.log('received day click event');

    this.predictions$.subscribe(pps => {
      if (pps) {
        this.selectedPP$.next(pps.find(pp => Globals.compareDates(pp.date, day)));
      }
    })



  }

  refresh(){
    this.budgetService.generatePredictionsBetweenDates(this.localConfig.startDate, this.localConfig.endDate).subscribe(
      (r) => {
        if (r) {
          this.predictions$.next(r);

        }
      },
      (error) => {
        console.error('RECEIVED generatePredictionsBetweenDates error: ', error);
      },
      () => {
        console.log('RECEIVED generatePredictionsBetweenDates completed');
      }
    );
  }



  ngOnInit(): void {

    this.config$.subscribe(r => {
      if(r){
        this.localConfig = r;
        this.refresh();
      }
    })
    

    



  }

}
