import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BudgetService } from 'src/app/services/budget/budget.service';

@Component({
  selector: 'app-when-will',
  templateUrl: './when-will.component.html',
  styleUrls: ['./when-will.component.scss']
})
export class WhenWillComponent implements OnInit {


  
  @Input()
  displayTitle: boolean = true;

  form:FormGroup;

  resultDateA:Date;


  
  constructor(
    private budget:BudgetService
  ) {

    this.form = new FormGroup({
      'amount' : new FormControl(null, [Validators.required]),
    });

    

  }

  ngOnInit(): void {
  }

  onFormSubmit(){
    console.log(this.form.controls.amount.value);

    this.budget.findDateWithValue(this.form.controls.amount.value).subscribe(r => {
      if(r){
        this.resultDateA = r;
      }
    });



  }

}
