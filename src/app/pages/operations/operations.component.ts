import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BudgetOperation } from 'src/app/models/BudgetOperation';
import { ScheduledBudgetOperation } from 'src/app/models/ScheduledBudgetOperation';
import { BudgetOperationService } from 'src/app/services/budget/budget-operation.service';
import { CreateNewOperationDialogComponent } from 'src/app/components/dialogs/create-new-operation-dialog/create-new-operation-dialog.component'
import { CreateNewScheduledOperationDialogComponent } from 'src/app/components/dialogs/create-new-scheduled-operation-dialog/create-new-scheduled-operation-dialog.component'
@Component({
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})
export class OperationsComponent implements OnInit, AfterViewInit {

  //allOperations: BudgetOperation[];

  constructor(
    private operationService: BudgetOperationService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    //this.getOperations();
  }

  ngAfterViewInit() {
    //this.operationService.refreshOperations();
  }

  onNewClick() {

    //open dialog for creating new operation
    let dialogRef = this.dialog.open(CreateNewOperationDialogComponent, { width: '100%' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        let new_operation: BudgetOperation = result;
        this.operationService.create(new_operation).subscribe(r => {
          console.log('result od add operation = ', r);
          //this.budget.refreshOperations();
        })

      }
    })


  }




  deleteOperation(operation: BudgetOperation) {
    console.log('receiver delete event, ', operation);
    this.operationService.delete(operation).subscribe(r => {
      console.log('deleteOperation result = ', r);
    })
  }
  modifyOperation(operation: BudgetOperation) {
    console.log('receiver modify event, ', operation);

    //open dialog

    let dialogRef = this.dialog.open(CreateNewOperationDialogComponent, { width: '100%', data: BudgetOperation.getCopy(operation) });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        let operation: BudgetOperation = result;
        this.operationService.update(operation).subscribe(r => {
          console.log('result = ', r);
          //this.budget.refreshOperations();
        })

      }
    })


  }



}
