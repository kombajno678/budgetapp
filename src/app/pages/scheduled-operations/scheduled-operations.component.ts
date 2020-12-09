import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewScheduledOperationDialogComponent } from 'src/app/components/dialogs/create-new-scheduled-operation-dialog/create-new-scheduled-operation-dialog.component';
import { ScheduledBudgetOperation } from 'src/app/models/ScheduledBudgetOperation';
import { ScheduledOperationsService } from 'src/app/services/budget/scheduled-operations.service';
import { BehaviorSubject, combineLatest, forkJoin, merge, zip } from 'rxjs';
import { getScheduleTypeName, ScheduleType } from 'src/app/models/internal/ScheduleType';
import { modifyScheduledOperationEvent } from 'src/app/components/list-elements/scheduled-operation-list-element/scheduled-operation-list-element.component';

@Component({
  selector: 'app-scheduled-operations',

  templateUrl: './scheduled-operations.component.html',
  styleUrls: ['./scheduled-operations.component.scss']
})
export class ScheduledOperationsComponent implements OnInit, OnDestroy {

  public ScheduleType = ScheduleType;

  @Input()
  displayTitle: boolean = true;


  scheduledOperations: ScheduledBudgetOperation[];
  scheduledOperations$: BehaviorSubject<ScheduledBudgetOperation[]> = new BehaviorSubject<ScheduledBudgetOperation[]>(null);
  //operationSchedules: OperationSchedule[];

  public displayedScheduletypes: ScheduleType[] = [ScheduleType.daily, ScheduleType.weekly, ScheduleType.monthly, ScheduleType.annually];


  constructor(
    private scheduledOperationsService: ScheduledOperationsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.refresh();

  }

  updateOperations(sops: ScheduledBudgetOperation[]) {
    this.scheduledOperations = sops;
    this.scheduledOperations.forEach(sop => {
      ScheduledBudgetOperation.initScheduleType(sop);
    });
    this.scheduledOperations$.next(this.scheduledOperations);
  }

  refresh() {

    this.scheduledOperations$.next(null);
    combineLatest([
      this.scheduledOperationsService.getAll()
    ]).subscribe(
      r => {
        console.log('combineLatest  = ', r);
        // if result is null that means that nothing has been emitted yet
        if (r[0] /*&& r[1]*/) {
          this.updateOperations(r[0]);
          console.log('this.scheduledOperations = ', this.scheduledOperations);
        }
      },
      err => console.error('both: error : ', err),
      () => console.log('both completed')
    );

  }

  ngOnDestroy(): void {
    this.scheduledOperations = null;
    this.scheduledOperations$.complete();
    //this.operationSchedules = null;
  }

  getScheduleTypeName(type: ScheduleType) {
    return getScheduleTypeName(type);
  }


  getScheduleTypes(): ScheduleType[] {
    return this.displayedScheduletypes;
  }

  getScheduledOperationsByType(type: ScheduleType) {
    return this.scheduledOperations?.filter(op => op.scheduleType === type);
  }



  deleteAll() {

    if (confirm(`Are you sure that you want to delete all ${this.scheduledOperations.length} operations?`)) {
      this.scheduledOperationsService.getAll().subscribe(ops => {
        if (ops && ops.length > 0) {
          console.log('deleting ' + ops.length + ' operations ...');
          this.scheduledOperationsService.deleteMany(ops).subscribe(r => {
            console.log('result of delete many = ', r);
            this.refresh();
          })
        }
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
  modifyOperation(modifyEvent: modifyScheduledOperationEvent) {
    console.log('receiver modify event, ', modifyEvent);
    this.scheduledOperationsService.update(modifyEvent.new).subscribe(r => {
      console.log('result od modifyOperation = ', r);
    })

  }

  chnageActiveState(operation: ScheduledBudgetOperation) {

    this.scheduledOperationsService.update(operation).subscribe(r => {
      console.log('result od update operation = ', r);
    })

  }

}
