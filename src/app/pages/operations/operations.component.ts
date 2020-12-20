import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { BehaviorSubject, combineLatest } from 'rxjs';
import { ScheduledOperationsService } from 'src/app/services/budget/scheduled-operations.service';
import { modifyEvent } from 'src/app/models/internal/modifyEvent';
import { CategoryService } from 'src/app/services/budget/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})
export class OperationsComponent implements OnInit, AfterViewInit, OnDestroy {

  allOperations: BudgetOperation[];
  displayedOperations$: BehaviorSubject<BudgetOperation[]>;

  //distinctDays: Set<Date>;

  startDate: Date;
  endDate: Date;

  filterShowIncome: boolean = true;
  filtershowExponses: boolean = true;

  dateRangeDynamic: boolean = false;

  @Input()
  quiet:boolean = false;

  //howManyDays = 5;

  public compareDates = Globals.compareDates;


  form: FormGroup;


  constructor(
    private operationService: BudgetOperationService,
    private schedulesOperationsService: ScheduledOperationsService,
    private categoriesService: CategoryService,
    private budgetService: BudgetService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snack:MatSnackBar
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

    this.displayedOperations$ = new BehaviorSubject(null);


    this.form = this.fb.group({
      startDate: [moment(), { validators: [Validators.required], updateOn: 'blur' }],
      endDate: [moment(), { validators: [Validators.required], updateOn: 'blur' }]
    })

    this.setDateRangeWeek();


    this.refresh();

    //TODO get only those that fit selected daterange


    this.form.controls.startDate.valueChanges.subscribe(r => {
      if (this.dateRangeDynamic) this.onDateRangeSelectionchange();
    });
    this.form.controls.endDate.valueChanges.subscribe(r => {
      if (this.dateRangeDynamic) this.onDateRangeSelectionchange();
    });

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.allOperations = null;
    this.displayedOperations$.complete();

  }

  refresh() {
    combineLatest([
      this.schedulesOperationsService.getAll(),
      this.operationService.getAll(),
      this.categoriesService.getAll(),
    ]).subscribe(r => {
      console.log('combineLatest : ', r);
      if (r[0] && r[1] && r[2]) {
        this.allOperations = r[1].sort((a, b) => b.when.getTime() - a.when.getTime());
        this.allOperations.forEach(op => {
          if (op.scheduled_operation_id) {
            op.scheduled_operation = r[0].find(so => so.id === op.scheduled_operation_id);
          }
          if (op.category_id) {
            op.category = r[2].find(so => so.id === op.category_id);
          }
        })
      }else{
        this.allOperations = [];
        
        
      }
      if(this.allOperations.length == 0){
        if(!this.quiet)this.snack.open('You have no operations :(', 'close', {duration: 3000});

      }
      this.updateDisplayedOperations();
    })
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

    console.log('next : ', x);
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

    if (confirm(`Are you sure that you want to delete all ${this.allOperations.length} operations?`)) {
      //this.displayedOperations$.next(null);
      this.operationService.deleteAll().subscribe(deleted => {
        console.log('deleted : ', deleted);
      })

    }

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
  modifyOperation(event: modifyEvent<BudgetOperation>) {
    console.log('receiver modify event, ', event.new);
    this.operationService.update(event.new).subscribe(r => {
      console.log('result = ', r);
      //this.budget.refreshOperations();
    })

  }



}
