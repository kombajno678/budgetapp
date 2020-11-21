import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { OperationSchedule } from 'src/app/models/OperationSchedule';
import { ScheduledBudgetOperation } from 'src/app/models/ScheduledBudgetOperation';



export enum ScheduleType {
  daily,
  weekly,
  monthly,
  annually
}

@Component({
  templateUrl: './create-new-scheduled-operation-dialog.component.html',
  styleUrls: ['./create-new-scheduled-operation-dialog.component.scss']
})
export class CreateNewScheduledOperationDialogComponent implements OnInit {

  selectedTab = 0;

  form: FormGroup;

  operation: ScheduledBudgetOperation;

  @ViewChild('operationTypeOption')
  operationTypeOption: MatButtonToggleGroup;

  @ViewChild('operationDateOption')
  operationDateOption: MatButtonToggleGroup;



  @ViewChild('daysOfWeekSelectionList')
  daysOfWeekSelectionList: MatSelectionList;

  @ViewChild('daysOfMonthsSelectionList')
  daysOfMonthSelectionList: MatSelectionList;
  @ViewChild('annuallyDaysOfMonthsSelectionList')
  annuallyDaysOfMonthSelectionList: MatSelectionList;

  @ViewChild('monthsSelectionList')
  monthsSelectionList: MatSelectionList;

  scheduleType: ScheduleType;



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


  constructor(public dialogRef: MatDialogRef<CreateNewScheduledOperationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ScheduledBudgetOperation) {
    if (data) {


      this.operation = data;
      this.acceptButtonTest = this.updateButtonText;
      this.title = this.updateTitle;
    } else {
      this.operation = new ScheduledBudgetOperation();
      this.operation.value = null;
      this.operation.name = null;
      //this.operation.when = new Date();

      this.acceptButtonTest = this.createButtonText;
      this.title = this.createTitle;


    }

    this.form = new FormGroup({
      value: new FormControl(this.operation.value, [Validators.required, Validators.min(0.01)]),
      name: new FormControl(this.operation.name, [Validators.maxLength(50)]),
      //when: new FormControl(this.operation.when, [Validators.required]),
      //scheduled: new FormControl(false, [Validators.required]),
      //schedule_id: new FormControl(null, []),
    })
  }

  onSave() {
    console.log('dialog on save');


    if (this.operationTypeOption.value == 'expense') {
      this.operation.value = -this.form.controls.value.value;

    } else {
      this.operation.value = this.form.controls.value.value;

    }



    let schedule = new OperationSchedule();
    switch (this.scheduleType) {
      case ScheduleType.daily:
        break;
      case ScheduleType.weekly:
        schedule.day_of_week = this.daysOfWeekSelectionList.selectedOptions.selected.map(mlo => mlo.value).map(v => v.value);//TODO: get from form


        break;
      case ScheduleType.monthly:
        schedule.day_of_month = this.daysOfMonthSelectionList.selectedOptions.selected.map(mlo => mlo.value);//TODO: get from form
        break;
      case ScheduleType.annually:
        schedule.month = this.monthsSelectionList.selectedOptions.selected.map(mlo => mlo.value).map(v => v.value);//TODO: get from form
        schedule.day_of_month = this.annuallyDaysOfMonthSelectionList.selectedOptions.selected.map(mlo => mlo.value);//TODO: get from form
        break;
      default:
        console.error('this.scheduleType is null');
        //error
        return null;
    }
    this.operation.schedule = schedule;



    this.operation.name = this.form.controls.name.value;

    console.log(this.operation);

    this.dialogRef.close(this.operation);


  }

  ngOnInit(): void {

    this.updateScheduleType();




  }
  isFormInvalid() {

    let checkSchedule: boolean = true;
    switch (this.scheduleType) {
      case ScheduleType.daily:
        break;
      case ScheduleType.weekly:
        checkSchedule = this.daysOfWeekSelectionList.selectedOptions.selected.length >= 1;
        break;
      case ScheduleType.monthly:
        checkSchedule = this.daysOfMonthSelectionList.selectedOptions.selected.length >= 1;
        break;
      case ScheduleType.annually:
        checkSchedule = this.monthsSelectionList.selectedOptions.selected.length >= 1 &&
          this.annuallyDaysOfMonthSelectionList.selectedOptions.selected.length >= 1;
        break;
      default:
        //error
        return false;
    }
    return this.form.invalid || !checkSchedule;
  }


  updateScheduleType() {
    switch (this.selectedTab) {
      case 0:
        this.scheduleType = ScheduleType.daily;
        break;
      case 1:
        this.scheduleType = ScheduleType.weekly;
        break;
      case 2:
        this.scheduleType = ScheduleType.monthly;
        break;
      case 3:
        this.scheduleType = ScheduleType.annually;
        break;
      default:
        this.scheduleType = null;
    }
  }


  onScheduleTypeChange(event) {
    if (typeof event !== 'undefined') {
      this.selectedTab = event;
      this.updateScheduleType();
    }
  }



}
