import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewScheduledOperationDialogComponent } from 'src/app/components/dialogs/create-new-scheduled-operation-dialog/create-new-scheduled-operation-dialog.component';
import { ScheduledBudgetOperation } from 'src/app/models/ScheduledBudgetOperation';
import { ScheduledOperationsService } from 'src/app/services/budget/scheduled-operations.service';
import { BehaviorSubject, combineLatest, forkJoin, merge, zip } from 'rxjs';
import { getScheduleTypeName, ScheduleType } from 'src/app/models/internal/ScheduleType';
import { modifyEvent } from 'src/app/models/internal/modifyEvent';
import { CategoryService } from 'src/app/services/budget/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SortBy, SortConfig, SortOrder } from 'src/app/models/internal/SortConfig';
import { FilterConfig, OperationType } from 'src/app/models/internal/FilterConfig';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { Category } from 'src/app/models/Category';

@Component({
  selector: 'app-scheduled-operations',

  templateUrl: './scheduled-operations.component.html',
  styleUrls: ['./scheduled-operations.component.scss']
})
export class ScheduledOperationsComponent implements OnInit, OnDestroy {

  public ScheduleType = ScheduleType;

  @Input()
  displayTitle: boolean = true;


  @Input()
  quiet: boolean = false;

  allScheduledOperations: ScheduledBudgetOperation[];
  displayedScheduledOperations: ScheduledBudgetOperation[];
  displayedScheduledOperations$: BehaviorSubject<ScheduledBudgetOperation[]> = new BehaviorSubject<ScheduledBudgetOperation[]>(null);
  //operationSchedules: OperationSchedule[];

  allCategories$: BehaviorSubject<Category[]> = new BehaviorSubject(null);

  public filterConfig: FilterConfig = {
    operationType: OperationType.ANY,
    scheduleType: [
      ScheduleType.daily,
      ScheduleType.weekly,
      ScheduleType.monthly,
      ScheduleType.annually,
      null]
  };



  constructor(
    private scheduledOperationsService: ScheduledOperationsService,
    private categoriesService: CategoryService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {

    this.categoriesService.getAll().subscribe(r => {
      if(r){
        this.allCategories$.next(r);

      }
    })

  }

  ngOnInit(): void {

    this.refresh();

  }

  updateOperations() {
    console.log('updateOperations, ', this.filterConfig);
    
    //filter n sort
    this.displayedScheduledOperations = this.allScheduledOperations.filter(sop => {
      let f = true;
      if(this.filterConfig.operationType === OperationType.INCOME){
        f = f && (sop.value >= 0);

      }else if(this.filterConfig.operationType === OperationType.EXPENSE){
        f = f && (sop.value <= 0);
      }

      f = f && this.filterConfig.scheduleType.includes(sop.scheduleType);

      //console.log(sop.value,'match => ',  f)
      return f;
    });
    this.displayedScheduledOperations$.next(this.displayedScheduledOperations);

    
  }

  refresh() {

    this.displayedScheduledOperations$.next(null);
    combineLatest([
      this.scheduledOperationsService.getAll(),
      this.categoriesService.getAll()
    ]).subscribe(
      r => {
        console.log('combineLatest  = ', r);
        // if result is null that means that nothing has been emitted yet
        if (r.every(x => x)) {
          r[0].forEach(sop => {
            if (sop.category_id) {
              sop.category = r[1].find(c => c.id === sop.category_id);
            }
          })
          

          this.allScheduledOperations = r[0];
          this.allScheduledOperations.forEach(sop => {
            ScheduledBudgetOperation.initScheduleType(sop);
          });
          //filter n sort
          this.updateOperations();
          




          console.log('this.scheduledOperations = ', this.allScheduledOperations);
          if (this.allScheduledOperations.length == 0) {
            if (!this.quiet) this.snack.open('You have no operations :(', 'close', { duration: 3000 });

          }
        }
      },
      err => console.error('both: error : ', err),
      () => console.log('both completed')
    );

  }



  ngOnDestroy(): void {
    this.allScheduledOperations = null;
    this.displayedScheduledOperations$.complete();
    //this.operationSchedules = null;
  }

  getScheduleTypeName(type: ScheduleType) {
    return getScheduleTypeName(type);
  }


  getScheduleTypes(): ScheduleType[] {
    return this.filterConfig.scheduleType;
  }

  getScheduledOperationsByType(type: ScheduleType) {
    return this.displayedScheduledOperations?.filter(op => op.scheduleType === type);
  }



  deleteAll() {

    if (confirm(`Are you sure that you want to delete all ${this.allScheduledOperations.length} scheduled operations?`)) {
      this.scheduledOperationsService.deleteAll().subscribe(deleted => {
        console.log('deleted = ', deleted);
      })
    }



  }


  onNewClick() {

    //open dialog for creating new operation
    let dialogRef = this.dialog.open(CreateNewScheduledOperationDialogComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let new_operation: ScheduledBudgetOperation = result;
        this.scheduledOperationsService.create(new_operation).subscribe(r => {
          console.log('result od add operation = ', r);
        })
      }
    })


  }




  deleteOperation(operation: ScheduledBudgetOperation) {
    console.log('receiver delete event, ', operation);

    this.scheduledOperationsService.delete(operation).subscribe(r => {
      console.log('deleteOperation result = ', r);
    })

  }
  modifyOperation(modifyEvent: modifyEvent<ScheduledBudgetOperation>) {
    modifyEvent.new.id = modifyEvent.old.id;
    console.log('receiver modify event, ', modifyEvent);
    this.scheduledOperationsService.update(modifyEvent.new).subscribe(r => {
      if (r) {
        console.log('result od scheduledOperationsService.update = ', r);
        this.refresh();
      }
    })

  }

  chnageActiveState(operation: ScheduledBudgetOperation) {

    this.scheduledOperationsService.update(operation).subscribe(r => {
      console.log('result od update operation = ', r);
    })

  }


















  onOperationsTypeChange(event: MatButtonToggleChange) {
    switch (event.value) {
      case 'income':
        this.filterConfig.operationType = OperationType.INCOME;
        break;
      case 'expense':
        this.filterConfig.operationType = OperationType.EXPENSE;
        break;
      case 'all':
        this.filterConfig.operationType = OperationType.ANY;
        break;
      default:
        this.filterConfig.operationType = OperationType.ANY;
        break;
    }
    this.updateOperations();

  }
  onRangeTypeChange(event: MatButtonToggleChange) {
    switch (event.value) {
      case 'daily':
        this.filterConfig.scheduleType = [ScheduleType.daily];
        break;
      case 'weekly':
        this.filterConfig.scheduleType = [ScheduleType.weekly];
        break;
      case 'monthly':
        this.filterConfig.scheduleType = [ScheduleType.monthly,];
        break;
      case 'all':
        this.filterConfig.scheduleType = [
          ScheduleType.daily,
          ScheduleType.weekly,
          ScheduleType.monthly,
          ScheduleType.annually,
          null];
        break;
      default:
        this.filterConfig.scheduleType = [
          ScheduleType.daily,
          ScheduleType.weekly,
          ScheduleType.monthly,
          ScheduleType.annually,
          null];
        break;
    }
    this.updateOperations();
  }

}
