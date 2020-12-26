import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PredictionChartCardConfig } from 'src/app/components/dashboard-cards/prediction-chart-card/prediction-chart-card.component';
import { BudgetService } from 'src/app/services/budget/budget.service';


export interface WhenWillResult {
  resultDateA: Date;
  yearsDiff: number;
  monthsDiff: number;
  daysDiff: number;
  chartConfig: PredictionChartCardConfig;

}

@Component({
  selector: 'app-when-will',
  templateUrl: './when-will.component.html',
  styleUrls: ['./when-will.component.scss']
})
export class WhenWillComponent implements OnInit {



  @Input()
  displayTitle: boolean = true;

  form: FormGroup;

  paddingDays = 7;

  result$:BehaviorSubject<WhenWillResult> = new BehaviorSubject<WhenWillResult>(null);
  chartConfig$:BehaviorSubject<PredictionChartCardConfig>= new BehaviorSubject<PredictionChartCardConfig>(null);



  constructor(
    private budget: BudgetService
  ) {

    this.form = new FormGroup({
      'amount': new FormControl(null, [Validators.required]),
    });




  }

  ngOnInit(): void {
  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }


  whenWillIHaveX(x: number): Observable<WhenWillResult> {

    let result = new BehaviorSubject<WhenWillResult>(null);


    let today = new Date();
    today.setUTCHours(12, 0, 0, 0);

    this.budget.findDateWithValue(x).subscribe(r => {
      if (r) {
        let when = r;

        //find years diff
        let yearsDiff = when.getFullYear() - today.getFullYear();


        //find months diff
        let monthsDiff = when.getUTCMonth() - today.getUTCMonth();
        if (monthsDiff < 0) {
          yearsDiff--;
          monthsDiff += 12
        }

        //find days diff
        let daysDiff = when.getUTCDate() - today.getUTCDate();
        if (daysDiff < 0) {
          monthsDiff--;
          let daysInMonth = this.daysInMonth(when.getMonth(), when.getFullYear());
          daysDiff += daysInMonth
        }



        let start = new Date(today);
        start.setDate(start.getDate() - this.paddingDays);


        let end = new Date(when);
        end.setDate(end.getDate() + this.paddingDays);

        let chartConfig = {
          startDate: start,
          endDate: end,
          title: `You will have ${x} at ${when.toISOString().substr(0, 10)}`,
          marks: [when],
          delayOnUpdate:true,
          disableControls : true

        }

        //init and next result
        result.next({
          resultDateA: when,
          yearsDiff: yearsDiff,
          monthsDiff: monthsDiff,
          daysDiff: daysDiff,
          chartConfig: chartConfig
        });




      }
    });

    return result;

  }


  onFormSubmit() {
    //console.log(this.form.controls.amount.value);


    let x = this.form.controls.amount.value;

    this.whenWillIHaveX(x).pipe(tap(r => console.log('whenWillIHaveX => tap : ', r))).subscribe(r => {
      //console.log(r);
      if(r){
        this.result$.next(r);
        this.chartConfig$.next(r.chartConfig);

      }

      
    });





  }

}
