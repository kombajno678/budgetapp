
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BudgetOperation } from 'src/app/models/BudgetOperation';
import { ScheduledBudgetOperation } from 'src/app/models/ScheduledBudgetOperation';
import { BudgetService } from 'src/app/services/budget/budget.service';



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
export class UploadComponent implements OnInit {

  myForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });


  report$: Subject<ReportResult> = new Subject<ReportResult>();




  uploadProgress: number = 0;

  constructor(private budgetService: BudgetService) { }

  ngOnInit(): void {
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

    this.budgetService.upload(formData).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.uploadProgress = Math.round(event.loaded * 100 / event.total);
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
          this.report$.next(event.body);
        }
      });



  }





}
