import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { PredictionChartCardConfig } from 'src/app/components/dashboard-cards/prediction-chart-card/prediction-chart-card.component';
import { BudgetService } from 'src/app/services/budget/budget.service';

@Component({
  selector: 'app-how-much-will',
  templateUrl: './how-much-will.component.html',
  styleUrls: ['./how-much-will.component.scss']
})
export class HowMuchWillComponent implements OnInit {

  @Input()
  displayTitle: boolean = true;

  form: FormGroup;



  predictedAmount: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  chartConfig$: BehaviorSubject<PredictionChartCardConfig> = new BehaviorSubject<PredictionChartCardConfig>(null);




  dateFilter = (d: Date | null): boolean => {
    return d > new Date()
  }



  constructor(private budget: BudgetService) {


    this.form = new FormGroup({
      day: new FormControl(null, [Validators.required]),
    })
  }

  ngOnInit(): void {
  }

  calculateAmountForDate(day: Date) {
    this.budget.generatePredictionForDate(day).subscribe(r => {
      if (r) this.predictedAmount.next(r.value);
    })
  }


  dateChange(event) {
    console.log('date changed to : ', event);
    let day = new Date(event.value);
    this.calculateAmountForDate(day);


    let chartConfig = {
      startDate: new Date(),
      endDate: day,
      title: `Prediction for day : ${day.toLocaleDateString()}`,
      marks: [day],
      delayOnUpdate: true,
      disableControls: true,
      compact: false,
      legend: false,

    }
    this.chartConfig$.next(chartConfig);



  }

}
