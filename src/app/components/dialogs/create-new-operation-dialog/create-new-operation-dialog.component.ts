import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { JAN } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment, { Moment } from 'moment';
import { Globals } from 'src/app/Globals';
import { BudgetOperation } from 'src/app/models/BudgetOperation';
import { Category } from 'src/app/models/Category';
import { CategoryService } from 'src/app/services/budget/category.service';


@Component({
  templateUrl: './create-new-operation-dialog.component.html',
  styleUrls: ['./create-new-operation-dialog.component.scss']
})
export class CreateNewOperationDialogComponent implements OnInit {


  form: FormGroup;

  operation: BudgetOperation;

  @ViewChild('operationTypeOption')
  operationTypeOption: MatButtonToggleGroup;
  operationValueSign = -1; // 1 or -1

  possibleCategories: Category[];



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


  constructor(
    public dialogRef: MatDialogRef<CreateNewOperationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BudgetOperation,
    private categoryService: CategoryService
  ) {


    this.categoryService.getAll().subscribe(r => {
      if (r) {
        this.possibleCategories = r;
      }
    })
    if (data) {


      this.operation = data;
      this.acceptButtonTest = this.updateButtonText;
      this.title = this.updateTitle;

      this.operationValueSign = this.operation.value;

      this.operation.value = this.operation.value < 0 ? -this.operation.value : this.operation.value;

      if (this.operation.category_id && !this.operation.category) {
        this.operation.category = this.possibleCategories.find(c => c.id === this.operation.category_id);
      }




    } else {
      this.operation = new BudgetOperation();
      this.operation.value = null;
      this.operation.name = null;
      this.operation.when = new Date();

      this.acceptButtonTest = this.createButtonText;
      this.title = this.createTitle;

      this.operationDateOption


    }

    this.form = new FormGroup({
      value: new FormControl(this.operation.value, [Validators.required, Validators.min(0.01)]),
      name: new FormControl(this.operation.name, [Validators.maxLength(50)]),
      when: new FormControl(moment(this.operation.when), [Validators.required]),
      scheduled: new FormControl(false, [Validators.required]),
      schedule_id: new FormControl(null, []),
      category: new FormControl(this.possibleCategories.find(cat => cat.id === this.operation.category_id), []),
      category_id: new FormControl(this.operation.category_id, []),
    })
  }

  ngOnInit(): void {



  }

  ngAfterViewInit() {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if(Globals.compareDates(new Date(), this.operation.when)){
      this.operationDateOption.value = 'today';
    }else if(Globals.compareDates(yesterday, this.operation.when)){
      this.operationDateOption.value = 'yesterday';
    }else{
      this.operationDateOption.value = 'other';

    }
  }

  onSave() {
    console.log('dialog on save')

    if (this.operationTypeOption.value == 'expense') {
      this.operation.value = -this.form.controls.value.value;

    } else {
      this.operation.value = this.form.controls.value.value;

    }

    this.operation.name = this.form.controls.name.value;
    if(this.form.controls.category.value){
      this.form.controls.category_id.setValue(this.form.controls.category.value.id);

    }else{}
    this.form.controls.category_id.setValue(null);
    this.operation.category_id = this.form.controls.category_id.value;
    //delete this.operation.category;


    if (this.operationDateOption.value == 'today') {
      this.operation.when = new Date();
      this.operation.when.setUTCHours(0, 0, 0, 0);
      let temp: Moment = moment(this.operation.when);
      temp.add(12, 'hours');
      this.operation.when = temp.toDate();

    } else if (this.operationDateOption.value == 'yesterday') {
      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      this.operation.when = yesterday;
      this.operation.when.setUTCHours(0, 0, 0, 0);
      let temp: Moment = moment(this.operation.when);
      temp.add(12, 'hours');
      this.operation.when = temp.toDate();

    } else {
      this.operation.when = this.form.controls.when.value.add(12, 'hours');
    }
    console.log(this.operation.when);
    this.dialogRef.close(this.operation);
  }

}
