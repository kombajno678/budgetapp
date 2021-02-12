import { Component, Input, OnInit, Output } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { Router } from '@angular/router';
import moment from 'moment';
import { Observable } from 'rxjs';
import { BudgetOperation } from 'src/app/models/BudgetOperation';
import { PredictionPoint } from 'src/app/models/internal/PredictionPoint';


export interface PredictionsGroup {
  predictions: PredictionPoint[],
  name: string,
  expensesSum: number,
  incomeSum: number,

  expensesSumMax: boolean,
  incomeSumMax: boolean,

  numberOfOperations: number,
  operations: BudgetOperation[],


}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  groupedPredictions: PredictionsGroup[] = [];

  
  @Input()
  predictions$:Observable<PredictionPoint[]>;


  @Input()
  compact:boolean = false;
  @Input()
  top:number = 0;

  private predictions:PredictionPoint[];

  @Input()
  summaryRangeType: string = 'month';

  constructor(private router:Router) { }

  ngOnInit(): void {


    this.predictions$.subscribe(r => {
      if(r){
        console.log('SUMMARY received', r);
        this.predictions = r;
        this.refresh();
      }


    })
  }


  onSummaryTypeChange(event: MatButtonToggleChange) {
    this.summaryRangeType = event.value;
    this.refresh();


  }

  displayValue(number: number) {
    return Number(number.toFixed(2)).toLocaleString();
  }

  redirectToOperations(g:PredictionsGroup){
    this.router.navigate(['/operations'], {
      queryParams: {
        start: g.predictions[0].date.toISOString().substr(0, 10),
        end: g.predictions[g.predictions.length-1].date.toISOString().substr(0, 10)
      }
    });

  }




  refresh() {


    //group predictions
    this.groupedPredictions = [];
    //find distinct months in predictions
    this.predictions.forEach(pp => {
      let m = moment(pp.date);
      let name: string = '';

      switch (this.summaryRangeType) {
        case 'year':
          name = m.format('YYYY');
          break;
        case 'quarter':
          name = m.format('YYYY-Q').replace('-', '-Q');;
          break;
        case 'month':
          name = m.format('YYYY-MM');

          break;
        case 'week':

          name = m.format('YYYY-WW').replace('-', '-W');
          break;
        case 'day':
          name = m.format('YYYY-MM-DD')

          break;
        default:
          break;
      }




      //console.log(name);

      let group = this.groupedPredictions.find(g => g.name === name);
      if (!group) {
        if(this.top > 0 && this.top <= this.groupedPredictions.length){
          //
        }else{
          this.groupedPredictions.unshift({
            name: name,
            predictions: [pp],
            expensesSum: 0,
            incomeSum: 0,
            expensesSumMax: false,
            incomeSumMax: false,
            numberOfOperations: 0,
            operations: []
  
          });
        }

        
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
          g.numberOfOperations++;
          g.operations.push(op);
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
    });


    console.log('SUMMARY groupedPredictions', this.groupedPredictions);



  }





}
