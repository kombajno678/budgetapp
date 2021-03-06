import { AfterViewInit, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { ScheduledBudgetOperation } from 'src/app/models/ScheduledBudgetOperation';
import { ScheduleType } from 'src/app/models/internal/ScheduleType';

import { VerboseDateStuff } from 'src/app/models/internal/VerboseDateStuff';
import { CategoryService } from 'src/app/services/budget/category.service';
import { Category } from 'src/app/models/Category';



@Component({
  templateUrl: './create-new-scheduled-operation-dialog.component.html',
  styleUrls: ['./create-new-scheduled-operation-dialog.component.scss']
})
export class CreateNewScheduledOperationDialogComponent implements OnInit, AfterViewInit {

  //selectedTab = 0;

  form: FormGroup;

  operation: ScheduledBudgetOperation;

  @ViewChild('operationTypeOption')
  operationTypeOption: MatButtonToggleGroup;
  operationValueSign = -1; // 1 or -1

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



  months = VerboseDateStuff.months;
  daysOfWeek = VerboseDateStuff.daysOfWeek;
  daysOfMonth = VerboseDateStuff.daysOfMonth;


  createTitle: string = 'New Operation';
  updateTitle: string = 'Modify operation';
  createButtonText: string = 'Add';
  updateButtonText: string = 'Save';

  acceptButtonTest: string = null;
  title: string = null;

  possibleCategories: Category[];



  constructor(
    public dialogRef: MatDialogRef<CreateNewScheduledOperationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ScheduledBudgetOperation,
    private categoryService: CategoryService
  ) {



    if (data) {




      this.operation = data;
      this.acceptButtonTest = this.updateButtonText;
      this.title = this.updateTitle;
      this.operationValueSign = this.operation.value;

      this.operation.value = this.operation.value < 0 ? -this.operation.value : this.operation.value;



      //console.log(this.operation);
      //check what chedule it is
      if (!this.operation.scheduleType) {
        ScheduledBudgetOperation.initScheduleType(this.operation);
      }
      this.scheduleType = this.operation.scheduleType;


    } else {
      this.operation = new ScheduledBudgetOperation();
      this.operation.value = null;
      this.operation.name = null;
      //this.operation.schedule = new OperationSchedule();
      this.operation.scheduleType = ScheduleType.monthly;
      this.scheduleType = this.operation.scheduleType;      //this.operation.when = new Date();

      this.acceptButtonTest = this.createButtonText;
      this.title = this.createTitle;


    }
    this.form = new FormGroup({
      value: new FormControl(this.operation.value, [Validators.required, Validators.min(0.01)]),
      name: new FormControl(this.operation.name, [Validators.maxLength(50)]),
      //when: new FormControl(this.operation.when, [Validators.required]),
      //scheduled: new FormControl(false, [Validators.required]),
      //schedule_id: new FormControl(null, []),
      formScheduleType: new FormControl(this.scheduleType, [Validators.min(0), Validators.max(3)]),
      formDaysOfWeek: new FormControl(this.operation.day_of_week, []),
      formDaysOfMonths: new FormControl(this.operation.day_of_month, []),
      formMonths: new FormControl(this.operation.month, []),
      category: new FormControl(null, []),
      category_id: new FormControl(this.operation.category_id, []),
    })



    this.categoryService.getAll().subscribe(r => {
      if (r) {
        this.possibleCategories = r;
        if (this.operation.category_id && !this.operation.category) {
          this.operation.category = this.possibleCategories.find(c => c.id === this.operation.category_id);
          this.form.controls.category.setValue(this.operation.category);
        }
      }
    })


    this.form.controls.formScheduleType.valueChanges.subscribe(newValue => {
      if (this.form.controls.formScheduleType.valid) {
        this.scheduleType = newValue;

      }
    })
  }

  ngOnInit(): void {

  }


  ngAfterViewInit() {

  }




  onSave() {
    console.log('dialog on save ', this.form);

    if (this.isFormInvalid()) {
      console.warn('isFormInvalid returned true');
      return;
    }


    if (this.operationTypeOption.value == 'expense') {
      this.operation.value = -this.form.controls.value.value;

    } else {
      this.operation.value = this.form.controls.value.value;

    }




    if(this.form.controls.category.value){
      this.operation.category_id = this.form.controls.category.value.id;

    }else{
      this.operation.category_id = null
    }
    //delete this.operation.category;


    //let schedule = new OperationSchedule();
    this.operation.day_of_week = [];
    this.operation.day_of_month = [];
    this.operation.month = [];

    switch (this.scheduleType) {
      case ScheduleType.daily:
        break;
      case ScheduleType.weekly:
        this.operation.day_of_week = this.form.controls.formDaysOfWeek.value.sort();
        break;
      case ScheduleType.monthly:
        this.operation.day_of_month = this.form.controls.formDaysOfMonths.value.sort();
        this.operation.day_of_month = this.form.controls.formDaysOfMonths.value.sort();
        break;
      case ScheduleType.annually:
        this.operation.month = this.form.controls.formMonths.value;
        this.operation.day_of_month = this.form.controls.formDaysOfMonths.value.sort();
        break;
      default:
        console.error('this.scheduleType is null');
        //error
        return null;
    }
    //this.operation.schedule = schedule;



    this.operation.name = this.form.controls.name.value;

    //console.log('this.operation', this.operation);

    this.dialogRef.close(this.operation);


  }



  isFormInvalid() {
    if (this.form.invalid) {
      return false;
    }

    let checkSchedule: boolean = true;

    switch (this.scheduleType) {
      case ScheduleType.daily:
        //checkSchedule = true;
        break;
      case ScheduleType.weekly:
        checkSchedule = this.form.controls.formDaysOfWeek.value.length >= 1;
        //checkSchedule = this.daysOfWeekSelectionList?.selectedOptions.selected.length >= 1;
        // if (!checkSchedule) {
        //   //console.warn('incorrent daysOfWeekSelectionList');
        // }
        break;
      case ScheduleType.monthly:
        checkSchedule = this.form.controls.formDaysOfMonths.value.length >= 1;
        //checkSchedule = this.daysOfMonthSelectionList?.selectedOptions.selected.length >= 1;
        // if (!checkSchedule) {
        //   //console.warn('incorrent daysOfMonthSelectionList');
        // }
        break;
      case ScheduleType.annually:
        checkSchedule = this.form.controls.formMonths.value.length >= 1 &&
          this.form.controls.formDaysOfMonths.value.length >= 1;
        // if (!checkSchedule) {
        //   //console.warn('incorrent monthsSelectionList or annuallyDaysOfMonthSelectionList');
        // }
        break;
      default:
        //error
        checkSchedule = false;
    }
    return !checkSchedule;
  }



}
