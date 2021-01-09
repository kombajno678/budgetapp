import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Globals } from 'src/app/Globals';
import { FixedPoint } from 'src/app/models/FixedPoint';

@Component({
  templateUrl: './create-new-fixed-point-dialog.component.html',
  styleUrls: ['./create-new-fixed-point-dialog.component.scss']
})
export class CreateNewFixedPointDialogComponent implements OnInit, AfterViewInit {

  form: FormGroup;

  fixedPoint: FixedPoint;

  @ViewChild('operationDateOption')
  operationDateOption: MatButtonToggleGroup;

  createTitle: string = 'New fixed point';
  updateTitle: string = 'Modify fixed point';
  createButtonText: string = 'Add';
  updateButtonText: string = 'Save';

  acceptButtonTest: string = null;
  title: string = null;

  constructor(
    public dialogRef: MatDialogRef<CreateNewFixedPointDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FixedPoint
  ) {
    if (data) {
      this.fixedPoint = data;
      this.acceptButtonTest = this.updateButtonText;
      this.title = this.updateTitle;

      
    } else {
      this.fixedPoint = new FixedPoint();
      this.fixedPoint.exact_value = null;
      this.fixedPoint.when = new Date();

      this.acceptButtonTest = this.createButtonText;
      this.title = this.createTitle;


    }

    this.form = new FormGroup({
      exact_value: new FormControl(this.fixedPoint.exact_value, [Validators.required]),
      when: new FormControl(this.fixedPoint.when, [Validators.required]),
    })
  }

  ngOnInit(): void {

    

  }
  
  ngAfterViewInit(){
    let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if(Globals.compareDates(new Date(), this.fixedPoint.when)){
        this.operationDateOption.value = 'today';
      }else if(Globals.compareDates(yesterday, this.fixedPoint.when)){
        this.operationDateOption.value = 'yesterday';
      }else{
        this.operationDateOption.value = 'other';

      }
  }



  onSave() {
    console.log('dialog on save')

    this.fixedPoint.exact_value = this.form.controls.exact_value.value;

    if (this.operationDateOption.value == 'today') {
      this.fixedPoint.when = new Date();
    } else if (this.operationDateOption.value == 'yesterday') {
      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      this.fixedPoint.when = yesterday;
    } else {
      this.fixedPoint.when = this.form.controls.when.value;
    }

    this.dialogRef.close(this.fixedPoint);


  }


}
