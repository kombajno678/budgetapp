import { Component, OnInit } from '@angular/core';
import { BudgetOperationService } from 'src/app/services/budget/budget-operation.service';
import { BudgetService } from 'src/app/services/budget/budget.service';

@Component({
  selector: 'app-operations-card',
  templateUrl: './operations-card.component.html',
  styleUrls: ['./operations-card.component.scss']
})
export class OperationsCardComponent implements OnInit {

  operations = [];

  link = {
    title: 'Recent operations',
    url: '/operations',
    icon: 'money',
    loginRequired: true,


  }




  constructor(public operationService: BudgetOperationService) {
    this.operationService.getAll()
      .subscribe(r => {
        if (r) {

          this.operations = r.slice(0, 5);
        }
      })
  }

  ngOnInit(): void {
  }

}
