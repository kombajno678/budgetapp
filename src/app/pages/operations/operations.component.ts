import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BudgetOperationService } from 'src/app/services/budget/budget-operation.service';
import { CreateNewOperationDialogComponent } from 'src/app/components/dialogs/create-new-operation-dialog/create-new-operation-dialog.component'
import { BudgetService } from 'src/app/services/budget/budget.service';
import { BudgetOperation } from 'src/app/models/BudgetOperation';

import { Globals } from 'src/app/Globals';

import { ScheduledBudgetOperation } from 'src/app/models/ScheduledBudgetOperation';
import { CreateNewScheduledOperationDialogComponent } from 'src/app/components/dialogs/create-new-scheduled-operation-dialog/create-new-scheduled-operation-dialog.component'
import { getLocaleTimeFormat } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})
export class OperationsComponent implements OnInit, AfterViewInit {

  allOperations: BudgetOperation[];
  displayedOperations$: BehaviorSubject<BudgetOperation[]>;

  //distinctDays: Set<Date>;

  startDate: Date;
  endDate: Date;

  filterShowIncome: boolean = true;
  filtershowExponses: boolean = true;

  dateRangeDynamic: boolean = false;

  //howManyDays = 5;

  public compareDates = Globals.compareDates;


  form: FormGroup;


  constructor(
    private operationService: BudgetOperationService,
    private budgetService: BudgetService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {




  }

  setDateRangeWeek() {
    //console.log('setDateRangeWeek');

    this.endDate = new Date();
    this.endDate.setUTCHours(12, 0, 0, 0);

    this.startDate = new Date(this.endDate);
    this.startDate.setDate(this.startDate.getDate() - 7);

    this.form.controls.endDate.setValue(this.endDate);
    this.form.controls.startDate.setValue(this.startDate);
  }
  setDateRageMonth() {
    //console.log('setDateRageMonth');


    this.endDate = new Date();
    this.endDate.setUTCHours(12, 0, 0, 0);

    this.startDate = new Date(this.endDate);
    this.startDate.setMonth(this.startDate.getMonth() - 1);

    this.form.controls.endDate.setValue(this.endDate);
    this.form.controls.startDate.setValue(this.startDate);
  }

  getDaysInRange = function (startDate: Date, endDate: Date) {
    let daysRange = [];
    for (var d = new Date(startDate); d <= endDate; d.setDate(d.getUTCDate() + 1)) {
      d.setUTCHours(0, 0, 0, 0);
      daysRange.push(new Date(d));
    }
    return daysRange;
  }

  onOperationsTypeChange(event: MatButtonToggleChange) {
    switch (event.value) {
      case 'all':
        this.filterShowIncome = true;
        this.filtershowExponses = true;
        this.updateDisplayedOperations();
        break;
      case 'income':
        this.filterShowIncome = true;
        this.filtershowExponses = false;
        this.updateDisplayedOperations();
        break;
      case 'expenses':
        this.filterShowIncome = false;
        this.filtershowExponses = true;
        this.updateDisplayedOperations();
        break;
      default:
        break;
    }
  }

  onRangeTypeChange(event: MatButtonToggleChange) {
    switch (event.value) {
      case 'week':
        this.dateRangeDynamic = false;


        this.setDateRangeWeek();
        this.updateDisplayedOperations();
        break;
      case 'month':
        this.dateRangeDynamic = false;
        this.setDateRageMonth();
        this.updateDisplayedOperations();
        break;
      default:
        this.dateRangeDynamic = true;
        break;
    }
  }

  ngOnInit(): void {

    this.displayedOperations$ = new BehaviorSubject([]);


    this.form = this.fb.group({
      startDate: [moment(), { validators: [Validators.required], updateOn: 'blur' }],
      endDate: [moment(), { validators: [Validators.required], updateOn: 'blur' }]
    })
    /*

    this.form = new FormGroup({
      startDate: new FormControl(moment(), []),
      endDate: new FormControl(moment(), []),
      
    });*/



    this.setDateRangeWeek();


    //this.getOperations();
    this.operationService.getAll().subscribe(r => {
      if (r) {
        this.allOperations = r.sort((a, b) => b.when.getTime() - a.when.getTime());
        this.updateDisplayedOperations();
        //this.distinctDays = new Set(this.allOperations.map(op => op.when).sort((a, b) => a.getTime() - b.getTime()));
      }
    });
    //TODO get only those that fit selected daterange


    this.form.controls.startDate.valueChanges.subscribe(r => {
      if (this.dateRangeDynamic) this.onDateRangeSelectionchange();
    });
    this.form.controls.endDate.valueChanges.subscribe(r => {
      if (this.dateRangeDynamic) this.onDateRangeSelectionchange();
    });

  }

  ngAfterViewInit() {
    //this.operationService.refreshOperations();
  }



  onDateRangeSelectionchange() {
    this.onFormSubmit();
  }
  onFormSubmit() {
    //console.log('onFormSubmit');

    this.startDate = new Date(this.form.controls.startDate.value);
    this.endDate = new Date(this.form.controls.endDate.value);
    this.updateDisplayedOperations();




  }
  updateDisplayedOperations() {
    let x = this.allOperations?.filter(op => {
      let filter = true;
      if (this.filterShowIncome && this.filtershowExponses) filter = true;
      else if (!this.filterShowIncome && this.filtershowExponses) filter = op.value < 0;
      else if (this.filterShowIncome && !this.filtershowExponses) filter = op.value >= 0;
      return filter && op.when >= this.startDate && op.when <= this.endDate;
    });

    this.displayedOperations$.next(x);

  }


  getDistinctDays(): Date[] {
    if (this.allOperations) {
      return this.getDaysInRange(this.startDate, this.endDate)
        .reverse()
        .filter(d =>
          this.allOperations.map(op => op.when)
            .find(when => Globals.compareDates(when, d))
        );

    } else {
      return [];
    }


  }
  getOperationsByDate(d: Date) {
    if (this.allOperations) {
      return this.allOperations.filter(op => {
        return Globals.compareDates(op.when, d);
      });
    } else {
      return [];
    }



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
    let dialogRef = this.dialog.open(CreateNewOperationDialogComponent, { width: '500px' });
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

    let dialogRef = this.dialog.open(CreateNewOperationDialogComponent, { width: '500px', data: BudgetOperation.getCopy(operation) });

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
