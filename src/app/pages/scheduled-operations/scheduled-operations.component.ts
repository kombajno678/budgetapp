import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewScheduledOperationDialogComponent } from 'src/app/components/dialogs/create-new-scheduled-operation-dialog/create-new-scheduled-operation-dialog.component';
import { OperationSchedule } from 'src/app/models/OperationSchedule';
import { ScheduledBudgetOperation } from 'src/app/models/ScheduledBudgetOperation';
import { ScheduledOperationsService } from 'src/app/services/budget/scheduled-operations.service';
import { OperationSchedulesService } from 'src/app/services/budget/operation-schedules.service';
import { combineLatest, forkJoin, merge, zip } from 'rxjs';
import { getScheduleTypeName, ScheduleType } from 'src/app/models/internal/ScheduleType';

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
  operationSchedules: OperationSchedule[];

  public displayedScheduletypes: ScheduleType[] = [ScheduleType.daily, ScheduleType.weekly, ScheduleType.monthly, ScheduleType.annually];


  constructor(
    private scheduledOperationsService: ScheduledOperationsService,
    private dialog: MatDialog,
    private schedulesService: OperationSchedulesService) { }

  ngOnInit(): void {
    let scheduledOperationsObservable = this.scheduledOperationsService.getAll();
    let schedulesObservable = this.schedulesService.getAll();
    combineLatest([
      scheduledOperationsObservable,
      schedulesObservable
    ]).subscribe(
      r => {
        console.log('combineLatest  = ', r);
        // if result is null that means that nothing has been emitted yet
        if (r[0] && r[1]) {
          this.scheduledOperations = r[0];
          this.operationSchedules = r[1];
          this.operationSchedules.forEach(s => {
            OperationSchedule.initScheduleType(s);
          })

          this.scheduledOperations.forEach(op => {
            op.schedule = this.operationSchedules.find(s => s.id === op.schedule_id);
          })
        }

      },
      err => console.error('both: error : ', err),
      () => console.log('both completed')
    );

  }

  ngOnDestroy(): void {
    this.scheduledOperations = null;
    this.operationSchedules = null;
  }

  getScheduleTypeName(type: ScheduleType) {
    return getScheduleTypeName(type);
  }


  getScheduleTypes(): ScheduleType[] {
    return this.displayedScheduletypes;
  }

  getScheduledOperationsByType(type: ScheduleType) {
    return this.scheduledOperations?.filter(op => op.schedule.scheduleType === type);
  }

  onNewClick() {

    //open dialog for creating new operation
    let dialogRef = this.dialog.open(CreateNewScheduledOperationDialogComponent, { width: '100%' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        let new_operation: ScheduledBudgetOperation = result;


        //check if selected schedule exists
        let existing_schedule = this.operationSchedules.find(schedule => OperationSchedule.areEqual(schedule, new_operation.schedule));
        if (existing_schedule) {
          new_operation.schedule = existing_schedule;
          new_operation.schedule_id = new_operation.schedule.id;
          console.log(new_operation);
          this.scheduledOperationsService.create(new_operation).subscribe(r => {
            console.log('result od add operation = ', r);
          })

        } else {
          //if not, then create and get its id
          this.schedulesService.create(new_operation.schedule).subscribe(r => {
            console.log('create schedule result = ', r);
            //assign this id to scheduled operation
            new_operation.schedule = r;
            new_operation.schedule_id = r.id;
            console.log(new_operation);
            this.scheduledOperationsService.create(new_operation).subscribe(r => {
              console.log('result od add operation = ', r);
            })
          })
        }


      }
    })


  }




  deleteOperation(operation: ScheduledBudgetOperation) {
    console.log('receiver delete event, ', operation);

    this.scheduledOperationsService.delete(operation).subscribe(r => {
      console.log('deleteOperation result = ', r);
    })

  }
  modifyOperation(operation: ScheduledBudgetOperation) {
    console.log('receiver modify event, ', operation);

    //open dialog

    let dialogRef = this.dialog.open(CreateNewScheduledOperationDialogComponent, { width: '100%', data: ScheduledBudgetOperation.getCopy(operation) });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let modified_operation: ScheduledBudgetOperation = result;
        //console.log(result);
        //check if selected schedule exists
        let existing_schedule = this.operationSchedules.find(schedule => {
          let result = OperationSchedule.areEqual(schedule, modified_operation.schedule);
          console.log('caomparing schedules ', schedule, modified_operation.schedule, 'result = ', result);
          return result;
        }
        );
        if (existing_schedule) {
          modified_operation.schedule = existing_schedule;
          modified_operation.schedule_id = modified_operation.schedule.id;
          console.log(modified_operation);
          this.scheduledOperationsService.update(modified_operation).subscribe(r => {
            console.log('result od update operation = ', r);
          })

        } else {
          //if not, then create and get its id
          this.schedulesService.create(modified_operation.schedule).subscribe(r => {
            console.log('create schedule result = ', r);
            //assign this id to scheduled operation
            modified_operation.schedule = r;
            modified_operation.schedule_id = r.id;
            console.log(modified_operation);
            this.scheduledOperationsService.update(modified_operation).subscribe(r => {
              console.log('result od update operation = ', r);
            })
          })
        }



      }
    })


  }

  chnageActiveState(operation: ScheduledBudgetOperation) {

    this.scheduledOperationsService.update(operation).subscribe(r => {
      console.log('result od update operation = ', r);
    })

  }

}
