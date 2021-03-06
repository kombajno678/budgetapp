import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/Globals';
import { BudgetOperationService } from 'src/app/services/budget/budget-operation.service';
import { BudgetService } from 'src/app/services/budget/budget.service';

@Component({
  selector: 'app-operations-card',
  templateUrl: './operations-card.component.html',
  styleUrls: ['./operations-card.component.scss']
})
export class OperationsCardComponent implements OnInit {

  operations = null;

  link = {
    title: 'Recent operations',
    url: '/operations',
    icon: 'money',
    loginRequired: true,


  }

  public compareDates = Globals.compareDates;



  constructor(public operationService: BudgetOperationService) {
    this.operationService.getAll()
      .subscribe(r => {
        if (r) {

          this.operations = r.slice(0, 5);
        }else{
          this.operations = null;
        }
      })
  }

  ngOnInit(): void {
  }

}
