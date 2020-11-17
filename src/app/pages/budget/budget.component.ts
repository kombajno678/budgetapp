import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BudgetOperation } from 'src/app/models/BudgetOperation';
import { BudgetService } from 'src/app/services/budget/budget.service';
import { CreateNewOperationDialogComponent } from 'src/app/components/dialogs/create-new-operation-dialog/create-new-operation-dialog.component'
@Component({
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent implements OnInit, AfterViewInit {

  allOperations: BudgetOperation[];

  constructor(
    private budget: BudgetService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    //this.getOperations();
  }

  ngAfterViewInit() {
    this.budget.refreshOperations();
  }

  onNewClick(event) {

    //open dialog for creating new operation
    let dialogRef = this.dialog.open(CreateNewOperationDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      let new_operation: BudgetOperation = result;
      this.budget.addOperation(new_operation).subscribe(r => {
        console.log('result od add operation = ', r);
        //this.budget.refreshOperations();
      })
    })


  }



}
