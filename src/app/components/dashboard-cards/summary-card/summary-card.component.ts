import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PredictionPoint } from 'src/app/models/internal/PredictionPoint';
import { BudgetService } from 'src/app/services/budget/budget.service';

@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss']
})
export class SummaryCardComponent implements OnInit {


  link = {
    title: 'Summary',
    url: '/prediction',
  }



  predictions: PredictionPoint[] = [];
  predictions$: BehaviorSubject<PredictionPoint[]> = new BehaviorSubject<PredictionPoint[]>(null);

  startDate: Date;
  endDate: Date;



  constructor(private budgetService: BudgetService) { }

  ngOnInit(): void {

    this.endDate = new Date();
    this.startDate = new Date();
    this.startDate.setMonth(this.startDate.getMonth() - 1);

    this.refresh();




  }


  refresh() {
    this.budgetService.generatePredictionsBetweenDates(this.startDate, this.endDate).subscribe(r => {
      //console.log('SUMMARY genereted ', r);
      if (r) {
        this.predictions = r;
        this.predictions$.next(this.predictions);
      }
    })

  }

}
