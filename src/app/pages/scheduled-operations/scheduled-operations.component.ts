import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewScheduledOperationDialogComponent } from 'src/app/components/dialogs/create-new-scheduled-operation-dialog/create-new-scheduled-operation-dialog.component';
import { OperationSchedule } from 'src/app/models/OperationSchedule';
import { ScheduledBudgetOperation } from 'src/app/models/ScheduledBudgetOperation';
import { ScheduledOperationsService } from 'src/app/services/budget/scheduled-operations.service';
import { OperationSchedulesService } from 'src/app/services/budget/operation-schedules.service';

@Component({
  templateUrl: './scheduled-operations.component.html',
  styleUrls: ['./scheduled-operations.component.scss']
})
export class ScheduledOperationsComponent implements OnInit {


  scheduledOperations: ScheduledBudgetOperation[];
  operationSchedules: OperationSchedule[];


  constructor(
    private scheduledOperationsService: ScheduledOperationsService,
    private dialog: MatDialog,
    private schedulesService: OperationSchedulesService) { }

  ngOnInit(): void {

    this.scheduledOperationsService.getAll().subscribe(r => this.scheduledOperations = r);
    this.schedulesService.getAll().subscribe(r => this.operationSchedules = r);


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
        console.log(result);
        let operation: ScheduledBudgetOperation = result;

        this.scheduledOperationsService.update(operation).subscribe(r => {
          console.log('result = ', r);
        })


      }
    })


  }

}
