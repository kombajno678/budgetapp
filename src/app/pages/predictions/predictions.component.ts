import { Component, OnInit } from '@angular/core';
import { BudgetOperation } from 'src/app/models/BudgetOperation';
import { FixedPointsService } from 'src/app/services/budget/fixed-points.service';
import { BudgetOperationService } from 'src/app/services/budget/budget-operation.service';
import { PredicionPoint } from 'src/app/models/internal/PredictionPoint';
import { BehaviorSubject, combineLatest, forkJoin, merge, Observable, of } from 'rxjs';

@Component({
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.scss']
})
export class PredictionsComponent implements OnInit {


  predictions: PredicionPoint[] = [];
  predictions$: BehaviorSubject<PredicionPoint[]>;


  constructor(
    private fixedPointService: FixedPointsService,
    private operationsService: BudgetOperationService
  ) { }

  ngOnInit(): void {
    this.predictions$ = new BehaviorSubject<PredicionPoint[]>(null);

    this.generate();
  }

  getDaysInRange = function (startDate: Date, endDate: Date) {
    let daysRange = [];
    for (var d = new Date(startDate); d <= endDate; d.setDate(d.getUTCDate() + 1)) {
      d.setUTCHours(0, 0, 0, 0);
      daysRange.push(new Date(d));
    }
    return daysRange;
  }
  compareDates(d1: Date, d2: Date) {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  }




  generate() {

    let endDate = new Date();
    let startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 90);
    endDate.setDate(endDate.getDate() + 90);


    let daysRange = this.getDaysInRange(startDate, endDate);
    //console.log(daysRange);

    this.predictions = daysRange.map(p => new PredicionPoint(p, 0));

    let x = combineLatest([
      this.fixedPointService.getAll(),
      this.operationsService.getAll()
    ]
    ).subscribe(r => {
      console.log('x : forkJoin\'d = ', r);
      if (r[0] && r[1]) {

        let fixedPoints = r[0];
        fixedPoints.forEach(fp => {
          this.predictions.filter(p => (p.date >= fp.when)).forEach(pp => pp.value = fp.exact_value);
        });

        let operations = r[1];
        operations.forEach(op => {
          this.predictions.filter(pr => (pr.date >= op.when)).forEach(pp => pp.value = pp.value + op.value);

        });



        this.predictions$.next(this.predictions);

      }
    })


  }

  getPredictions(): Observable<PredicionPoint[]> {

    return this.predictions$.asObservable();

  }

}
