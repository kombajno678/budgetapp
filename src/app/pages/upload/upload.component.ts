
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { forkJoin, of, ReplaySubject, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { modifyOperationEvent } from 'src/app/components/list-elements/operation-list-element/operation-list-element.component';
import { BudgetOperation } from 'src/app/models/BudgetOperation';
import { FixedPoint } from 'src/app/models/FixedPoint';
import { ScheduledBudgetOperation } from 'src/app/models/ScheduledBudgetOperation';
import { BudgetOperationService } from 'src/app/services/budget/budget-operation.service';
import { BudgetService } from 'src/app/services/budget/budget.service';
import { FixedPointsService } from 'src/app/services/budget/fixed-points.service';
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



  uploadProgress: number = 0;
  uploadBarMode: string = 'determinate';

  constructor(
    private budgetService: BudgetService,
    private operationsService: BudgetOperationService,
    private scheduledOpsService: ScheduledOperationsService,
    private fixedPointsService: FixedPointsService,
  ) {

  }

  ngOnInit(): void {


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
    // TODO : actually implement category
    this.report.ScheduledOperations.forEach(sop => {
      sop.category = null;
      sop.category_id = null;
    })
    this.scheduledOpsService.createMany(this.report.ScheduledOperations).subscribe(r => {
      console.log('result od add soperation = ', r);
    })
  }

  saveOperations() {
    // TODO : actually implement category
    this.report.Operations.forEach(op => {
      op.category = null;
      op.category_id = null;
    })

    forkJoin([
      this.operationsService.createMany(this.report.Operations),
    ]).subscribe(r => {
      console.log('result of operationsService.createMany = ', r);
      if (r) {
        //success

      }

    })
  }


  onSave() {
    console.log('save');
    // TODO: actually implement categories
    this.report.Operations.forEach(op => {
      op.category = null;
      op.category_id = null;

      delete op.category;
      delete op.category_id;
    })
    this.report.ScheduledOperations.forEach(sop => {
      sop.category = null;
      sop.category_id = null;

      delete sop.category;
      delete sop.category_id;
    })

    // try to generate fixed point (on first day )

    //find first day
    let firstDay: Date = new Date();
    this.report.Operations.forEach(op => {
      let when = new Date(op.when);
      if (when < firstDay) {
        firstDay = when;
      }
    })
    console.log('firstDay = ', firstDay.toISOString());


    //get fixed points
    this.fixedPointsService.getAllOnce().subscribe(fps => {
      if (fps) {
        console.log('fetched fps = ', fps);
        // find fixed point closest to first day (from operations to upload)
        let fpfiltered = fps.filter(fp => fp.when > firstDay);
        console.log('fpfiltered = ', fpfiltered);

        let fp = fpfiltered.sort((a, b) => a.when.getTime() - b.when.getTime())[0];
        if (!fp) {
          //display some error msg and abort
          //temp alert
          alert('Please crete a new fixed point first');
          return;
        }
        // calculate diff to that first day
        let diff = 0;
        this.report.Operations.filter(op => new Date(op.when) <= fp.when).forEach(op => diff += op.value);// error when no fp exists before
        let newFp = new FixedPoint();
        console.log('diff = ', diff);
        newFp.exact_value = fp.exact_value -= diff;
        newFp.when = firstDay;
        this.fixedPointsService.create(newFp).subscribe(createdNewFp => {
          console.log('createdNewFp = ', createdNewFp);
          if (createdNewFp) {

            //can actually continue
            // subscribe hell incoming

            this.scheduledOpsService.createMany(this.report.ScheduledOperations).subscribe(createdSops => {
              // if success
              console.log('scheduledOpsService.createMany = ', createdSops);
              if (createdSops) {

                //assign scheduled op id
                /*
                this.report.ScheduledOperations.forEach(sop => {
                  sop.id = createdSops.find(createdSop => createdSop.name === sop.name).id;
                })
                */


                this.report.Operations.filter(op => op.scheduled_operation).forEach(op => {
                  try {
                    console.log('searching for schedule of ', op.name);
                    let sop = createdSops.find(csop => csop.name === op.scheduled_operation.name);
                    console.log('found sop : ', sop)
                    op.scheduled_operation_id = sop.id;
                  } catch (error) {
                    console.error(error);
                    delete op.scheduled_operation_id;

                  } finally {
                    delete op.scheduled_operation;

                  }
                })

                this.operationsService.createMany(this.report.Operations).subscribe(createdOps => {
                  console.log('operationsService.createMany = ', createdOps);

                  if (createdOps) {
                    console.log('worked(?)');
                    console.log('createdNewFp = ', createdNewFp);
                    console.log('createdOps = ', createdOps);
                    console.log('createdSops = ', createdSops);

                    localStorage.removeItem('lastReport');
                    this.report = null;
                    this.report$.next(this.report);



                  } else {
                    //delete scheduled
                    this.scheduledOpsService.deleteMany(createdSops).subscribe(deletedSops => {
                      console.log('reverting changes');
                    })
                  }
                })
              }
            })


          }
        })
      }



    })






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
