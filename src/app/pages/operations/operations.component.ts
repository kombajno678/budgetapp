import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { MatButtonToggleChange, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { ScheduledOperationsService } from 'src/app/services/budget/scheduled-operations.service';
import { modifyEvent } from 'src/app/models/internal/modifyEvent';
import { CategoryService } from 'src/app/services/budget/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category } from 'src/app/models/Category';
import { MatSelectionList } from '@angular/material/list';
import { SortBy, SortConfig, SortOrder } from 'src/app/models/internal/SortConfig';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})
export class OperationsComponent implements OnInit, AfterViewInit, OnDestroy {

  allOperations: BudgetOperation[];

  displayedOperations$: BehaviorSubject<BudgetOperation[]> = new BehaviorSubject(null);
  allCategories$: BehaviorSubject<Category[]> = new BehaviorSubject(null);

  //distinctDays: Set<Date>;

  startDate: Date;
  endDate: Date;

  filterShowIncome: boolean = true;
  filtershowExponses: boolean = true;

  dateRangeDynamic: boolean = false;


  sortConfig: SortConfig = {
    by : SortBy.DATE,
    order: SortOrder.DESC
  };


  @Input()
  quiet: boolean = false;

  @ViewChild(MatSelectionList)
  categoriesSelectionList: MatSelectionList


  //howManyDays = 5;

  @ViewChild(MatButtonToggleGroup)
  rangeTypeGroup;

  
  
  form: FormGroup;
  
  public toStr = Globals.toStr;
  public compareDates = Globals.compareDates;


  constructor(
    public operationService: BudgetOperationService,
    public schedulesOperationsService: ScheduledOperationsService,
    public categoriesService: CategoryService,
    public budgetService: BudgetService,
    public dialog: MatDialog,
    public fb: FormBuilder,
    public snack: MatSnackBar,
    private route: ActivatedRoute
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

  onSortOrderChange(event: MatButtonToggleChange){
    switch (event.value) {
      case 'asc':
        this.sortConfig.order = SortOrder.ASC;
        this.updateDisplayedOperations();
        break;
      case 'desc':
        this.sortConfig.order = SortOrder.DESC;
        this.updateDisplayedOperations();
        break;
      default:
        break;
    }
  }

  onSortTypeChange(event: MatButtonToggleChange){
    switch (event.value) {
      case 'date':
        this.sortConfig.by = SortBy.DATE;
        this.updateDisplayedOperations();
        break;
      case 'value':
        this.sortConfig.by = SortBy.VALUE;
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
    this.categoriesService.getAll().subscribe(r => {
      if(r)this.allCategories$.next(r);
    })

    this.form = this.fb.group({
      startDate: [moment(), { validators: [Validators.required], updateOn: 'blur' }],
      endDate: [moment(), { validators: [Validators.required], updateOn: 'blur' }],
      categories: [[], { validators: [], updateOn: 'blur' }]
    })


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
      if (r.every(x => x)) {
        this.allOperations = r[1];
        this.allOperations.forEach(op => {
          if (op.scheduled_operation_id) {
            op.scheduled_operation = r[0].find(so => so.id === op.scheduled_operation_id);
          }
          if (op.category_id) {
            op.category = r[2].find(so => so.id === op.category_id);
          }
        });
        //if (!this.quiet && this.allOperations.length == 0) this.snack.open('You have no operations :(', 'close', { duration: 3000 });
        this.updateDisplayedOperations();
      }
    })
  }

  ngAfterViewInit() {
    //this.operationService.refreshOperations();

    this.route.queryParams.subscribe(params => {
      if (params['start'] && params['end']) {
        this.dateRangeDynamic = false;

        this.startDate = new Date(params['start']);
        this.endDate = new Date(params['end']);

        this.form.controls.startDate.setValue(params['start']);
        this.form.controls.endDate.setValue(params['end']);

        this.dateRangeDynamic = true;

      } else {
        this.setDateRangeWeek();
      }


      this.refresh();
    });



  }

  onDateRangeSelectionchange() {
    this.onFormSubmit();
  }

  categoriesListSelectionChange() {
    this.onFormSubmit();
  }

  onFormSubmit() {
    //console.log('onFormSubmit');
    this.startDate = new Date(this.form.controls.startDate.value);
    this.endDate = new Date(this.form.controls.endDate.value);
    this.form.controls.categories.setValue(this.categoriesSelectionList.selectedOptions.selected.map(s => s.value));
    this.updateDisplayedOperations();

  }

  updateDisplayedOperations() {
    let selectedCategories = this.form.controls.categories.value;
    console.log('selectedCategories = ', selectedCategories);
    console.log('this.startDate, this.endDate = ', this.startDate, this.endDate);

    

    let filtered = this.allOperations?.filter(op => {
      let filter = true;
      if (this.filterShowIncome && this.filtershowExponses) filter = true;
      else if (!this.filterShowIncome && this.filtershowExponses) filter = op.value < 0;
      else if (this.filterShowIncome && !this.filtershowExponses) filter = op.value >= 0;


      if (selectedCategories.length != 0) filter = filter && selectedCategories.find(cat => cat.id === op.category_id);


      return filter && op.when >= this.startDate && op.when <= this.endDate;
    });

    console.log('sorting ... ', this.sortConfig);
    let sorted = filtered.sort((a, b) => {
      let x:any, y:any;

      switch (this.sortConfig.by) {
        case SortBy.DATE:
          x = a.when;
          y = b.when;
          break;
        case SortBy.VALUE:
          x = Math.abs(a.value);
          y = Math.abs(b.value);
          break;
        default:
          break;
      }

      switch (this.sortConfig.order) {
        case SortOrder.ASC:
          return x - y;
        case SortOrder.DESC:
          return y - x;
        default:
          return 0;
      }

    });


    console.log('next : ', sorted);
    this.displayedOperations$.next(sorted);

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
        //console.log(result);
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
    this.operationService.update(event.new, true).subscribe(r => {
      console.log('operationService.update = ', r);
      //this.budget.refreshOperations();
    })

  }



}
