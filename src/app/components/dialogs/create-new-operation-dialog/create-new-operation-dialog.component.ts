import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BudgetOperation } from 'src/app/models/BudgetOperation';

@Component({
  templateUrl: './create-new-operation-dialog.component.html',
  styleUrls: ['./create-new-operation-dialog.component.scss']
})
export class CreateNewOperationDialogComponent implements OnInit {


  form: FormGroup;

  newOperation: BudgetOperation;


  constructor() {
    this.form = new FormGroup({
      value: new FormControl(0, [Validators.required]),
      name: new FormControl(null, [Validators.maxLength(50)]),
      when: new FormControl(new Date(), [Validators.required]),
    })
  }

  onSave() {
    this.newOperation = new BudgetOperation();

    this.newOperation.value = this.form.controls.value.value;
    this.newOperation.name = this.form.controls.name.value;
    this.newOperation.when = this.form.controls.when.value;

    return this.newOperation;

  }

  ngOnInit(): void {

  }



}
