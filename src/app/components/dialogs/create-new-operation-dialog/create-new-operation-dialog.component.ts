import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { JAN } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BudgetOperation } from 'src/app/models/BudgetOperation';


@Component({
  templateUrl: './create-new-operation-dialog.component.html',
  styleUrls: ['./create-new-operation-dialog.component.scss']
})
export class CreateNewOperationDialogComponent implements OnInit {


  form: FormGroup;

  operation: BudgetOperation;

  @ViewChild('operationTypeOption')
  operationTypeOption: MatButtonToggleGroup;


  @ViewChild('operationDateOption')
  operationDateOption: MatButtonToggleGroup;


  months = [
    { value: 1, display: 'Januray' },
    { value: 2, display: 'February' },
    { value: 3, display: 'March' },
    { value: 4, display: 'April' },
    { value: 5, display: 'May' },
    { value: 6, display: 'June' },
    { value: 7, display: 'July' },
    { value: 8, display: 'August' },
    { value: 9, display: 'September' },
    { value: 10, display: 'October' },
    { value: 11, display: 'November' },
    { value: 12, display: 'December' }
  ];
  daysOfWeek = [
    { value: 1, display: 'Monday' },
    { value: 2, display: 'Tuesday' },
    { value: 3, display: 'Wednesday' },
    { value: 4, display: 'Thursday' },
    { value: 5, display: 'Friday' },
    { value: 6, display: 'Saturday' },
    { value: 0, display: 'Sunday' }
  ];

  daysOfMonth = Array.from(Array(31), (_, x) => x + 1);






  createTitle: string = 'New Operation';
  updateTitle: string = 'Modify operation';
  createButtonText: string = 'Add';
  updateButtonText: string = 'Save';

  acceptButtonTest: string = null;
  title: string = null;


  constructor(public dialogRef: MatDialogRef<CreateNewOperationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: BudgetOperation) {
    if (data) {


      this.operation = data;
      this.acceptButtonTest = this.updateButtonText;
      this.title = this.updateTitle;
    } else {
      this.operation = new BudgetOperation();
      this.operation.value = null;
      this.operation.name = null;
      this.operation.when = new Date();

      this.acceptButtonTest = this.createButtonText;
      this.title = this.createTitle;


    }

    this.form = new FormGroup({
      value: new FormControl(this.operation.value, [Validators.required, Validators.min(0.01)]),
      name: new FormControl(this.operation.name, [Validators.maxLength(50)]),
      when: new FormControl(this.operation.when, [Validators.required]),
      scheduled: new FormControl(false, [Validators.required]),
      schedule_id: new FormControl(null, []),
    })
  }

  onSave() {
    console.log('dialog on save')

    if (this.operationTypeOption.value == 'expense') {
      this.operation.value = -this.form.controls.value.value;

    } else {
      this.operation.value = this.form.controls.value.value;

    }

    this.operation.name = this.form.controls.name.value;


    if (this.operationDateOption.value == 'today') {
      this.operation.when = new Date();
    } else if (this.operationDateOption.value == 'yesterday') {
      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      this.operation.when = yesterday;
    } else {
      this.operation.when = this.form.controls.when.value;
    }

    this.dialogRef.close(this.operation);


  }

  ngOnInit(): void {

    console.log('operationTypeOption = ', this.operationTypeOption);


  }



}
