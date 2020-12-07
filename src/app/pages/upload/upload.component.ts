
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { forkJoin, of, ReplaySubject, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { modifyOperationEvent } from 'src/app/components/list-elements/operation-list-element/operation-list-element.component';
import { BudgetOperation } from 'src/app/models/BudgetOperation';
import { OperationSchedule } from 'src/app/models/OperationSchedule';
import { ScheduledBudgetOperation } from 'src/app/models/ScheduledBudgetOperation';
import { BudgetOperationService } from 'src/app/services/budget/budget-operation.service';
import { BudgetService } from 'src/app/services/budget/budget.service';
import { OperationSchedulesService } from 'src/app/services/budget/operation-schedules.service';
import { ScheduledOperationsService } from 'src/app/services/budget/scheduled-operations.service';



export interface ReportResult {

  Operations: BudgetOperation[];
  ScheduledOperations: ScheduledBudgetOperation[];
  Categories: any[];

}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, AfterViewInit {

  myForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });


  report$: ReplaySubject<ReportResult> = new ReplaySubject<ReportResult>(1);
  report: ReportResult = null;


  operationSchedules = [];

  uploadProgress: number = 0;
  uploadBarMode: string = 'determinate';

  constructor(
    private budgetService: BudgetService,
    private operationsService: BudgetOperationService,
    private scheduledOpsService: ScheduledOperationsService,
    private schedulesService: OperationSchedulesService,
  ) {

  }

  ngOnInit(): void {
    this.schedulesService.getAll().subscribe(r => {
      this.operationSchedules = r;
    });



  }
  ngAfterViewInit() {
    let savedReport: ReportResult = JSON.parse(localStorage.getItem('lastReport'));
    console.log(savedReport);
    if (savedReport) {

      this.report$.next(savedReport);
      this.report = savedReport;

    }
  }

  onCancel() {
    console.log('cancel');
    localStorage.removeItem('lastReport');
  }


  saveScheduledOperations() {
    this.report.ScheduledOperations.forEach(sop => {
      sop.category = null;
      sop.category_id = null;
    })

    this.report.ScheduledOperations.forEach(sop => {
      let new_operation: ScheduledBudgetOperation = sop;
      //check if selected schedule exists
      let existing_schedule = this.operationSchedules.find(schedule => OperationSchedule.areEqual(schedule, new_operation.schedule));
      if (existing_schedule) {
        new_operation.schedule = existing_schedule;
        new_operation.schedule_id = new_operation.schedule.id;
        console.log(new_operation);
        this.scheduledOpsService.create(new_operation).subscribe(r => {
          console.log('result od add soperation = ', r);
        })

      } else {
        //if not, then create and get its id
        this.schedulesService.create(new_operation.schedule).subscribe(r => {
          console.log('create schedule result = ', r);
          if (r) {
            //assign this id to scheduled operation
            new_operation.schedule = r;
            new_operation.schedule_id = r.id;
            console.log(new_operation);
            this.scheduledOpsService.create(new_operation).subscribe(r => {
              console.log('result od add soperation = ', r);
            })
          }

        })
      }
    })


  }

  saveOperations() {
    this.report.Operations.forEach(op => {
      op.category = null;
      op.category_id = null;
    })

    forkJoin([
      this.operationsService.createMany(this.report.Operations),
    ]).subscribe(r => {
      console.log('result of saviong report = ', r);
      if (r && r[0]) {
        //success

      }

    })
  }


  onSave() {
    console.log('save');
    //brr send requests








    localStorage.removeItem('lastReport');
    this.report = null;
    this.report$.next(this.report);







  }



  get f() {
    return this.myForm.controls;
  }

  onFileChange(event) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.patchValue({
        fileSource: file
      });
    }
  }

  submit() {
    const formData = new FormData();
    formData.append('file', this.myForm.get('fileSource').value);
    this.uploadProgress = 0;
    this.uploadBarMode = 'determinate';

    this.report = null;
    this.report$.next(this.report);

    this.budgetService.upload(formData).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.uploadProgress = Math.round(event.loaded * 100 / event.total);
            if (this.uploadProgress >= 100) {
              this.uploadBarMode = 'indeterminate';
            }
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.uploadProgress = 0;
        return of(`upload failed`);
      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {
          console.log('upload finished', event);
          this.uploadProgress = 100;
          this.uploadBarMode = 'determinate';
          this.report = event.body;
          this.report$.next(this.report);

          localStorage.setItem('lastReport', JSON.stringify(event.body));
        }
      });



  }











  //










  deleteOperation(operation: BudgetOperation) {
    console.log('receiver delete event, ', operation);
    //this.report.Operations = this.report.Operations.filter(op => op !== operation);


    this.report.Operations.splice(this.report.Operations.indexOf(operation), 1);

  }
  modifyOperation(event: modifyOperationEvent) {
    console.log('receiver modify event, ', event);
    //

    var index = this.report.Operations.indexOf(event.old);
    if (index !== -1) {
      this.report.Operations[index] = event.new;
    }

  }





}
