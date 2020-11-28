import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BudgetOperationService } from 'src/app/services/budget/budget-operation.service';
import { CreateNewOperationDialogComponent } from 'src/app/components/dialogs/create-new-operation-dialog/create-new-operation-dialog.component'
import { BudgetService } from 'src/app/services/budget/budget.service';
import { BudgetOperation } from 'src/app/models/BudgetOperation';

import { Globals } from 'src/app/Globals';


/*
import { ScheduledBudgetOperation } from 'src/app/models/ScheduledBudgetOperation';
import { CreateNewScheduledOperationDialogComponent } from 'src/app/components/dialogs/create-new-scheduled-operation-dialog/create-new-scheduled-operation-dialog.component'
import { getLocaleTimeFormat } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
*/
@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})
export class OperationsComponent implements OnInit, AfterViewInit {

  allOperations: BudgetOperation[];

  distinctDays: Set<Date>;

  startDate: Date;
  endDate: Date;

  howManyDays = 5;

  //form: FormGroup;


  constructor(
    private operationService: BudgetOperationService,
    private budgetService: BudgetService,
    private dialog: MatDialog
  ) {
    this.endDate = new Date();
    this.endDate.setUTCHours(0, 0, 0, 0);

    this.startDate = new Date(this.endDate);
    this.startDate.setDate(this.startDate.getDate() - this.howManyDays);




  }

  getDaysInRange = function (startDate: Date, endDate: Date) {
    let daysRange = [];
    for (var d = new Date(startDate); d <= endDate; d.setDate(d.getUTCDate() + 1)) {
      d.setUTCHours(0, 0, 0, 0);
      daysRange.push(new Date(d));
    }
    return daysRange;
  }


  ngOnInit(): void {
    /*
        this.form = new FormGroup({
          startDate: new FormControl(moment(this.startDate.toISOString()), []),
          endDate: new FormControl(moment(this.endDate.toISOString()), []),
        })
        */
    //this.getOperations();
    this.operationService.getAll().subscribe(r => {
      if (r) {
        this.allOperations = r;
        this.distinctDays = new Set(this.allOperations.map(op => op.when).sort((a, b) => a.getTime() - b.getTime()));
      }
    });

  }

  ngAfterViewInit() {
    //this.operationService.refreshOperations();
  }


  onFormSubmit() {
    /*
    this.startDate = new Date(this.form.controls.startDate.value);
    this.endDate = new Date(this.form.controls.endDate.value);
    */

  }

  getDistinctDays(): Date[] {
    if (this.allOperations) {
      return this.getDaysInRange(this.startDate, this.endDate).reverse().filter(d => this.allOperations.map(op => op.when).find(when => Globals.compareDates(when, d)));

    } else {
      return [];
    }


  }
  getOperationsByDate(d: Date) {

    return this.allOperations?.filter(op => {
      return op.when.getDate() === d.getDate() && op.when.getMonth() === d.getMonth() && op.when.getFullYear() === d.getFullYear();
    });

  }


  generate() {
    this.budgetService.generateOperations();
  }

  deleteAllOperations() {

    this.operationService.getAll().subscribe(ops => {
      if (ops) {
        console.log('deleting ' + ops.length + ' operations ...');
        ops.forEach(op => {
          this.operationService.delete(op, false).subscribe(r => console.log(r));
        })
      }
    })

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
