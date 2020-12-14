import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BudgetOperationService } from 'src/app/services/budget/budget-operation.service';
import { CategoryService } from 'src/app/services/budget/category.service';
import { FixedPointsService } from 'src/app/services/budget/fixed-points.service';
import { ScheduledOperationsService } from 'src/app/services/budget/scheduled-operations.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileJson: string = null;

  constructor(
    public auth: AuthService, 
    public snack: MatSnackBar,

    private budgetOperationService:BudgetOperationService,
    private categoryService:CategoryService,
    private fixedPointsService:FixedPointsService,
    private scheduledOperationsService:ScheduledOperationsService) {

  }

  deleteAll(){
    if(confirm("Are you absolutely sure that you want to dele all your data? (This means essentially starting from scratch, like on a new account)")){
      console.log('brrr, deleting all', 'close');

      this.budgetOperationService.deleteAll().subscribe(r => {
        this.scheduledOperationsService.deleteAll().subscribe(r => {
          this.fixedPointsService.deleteAll().subscribe(r => {
            this.categoryService.deleteAll().subscribe(r => {
              console.log('deleting done');
              this.snack.open('Deleted all your data');
            })
          })
        })
      })



    }else{
      this.snack.open('Nothing has been deleted', 'close');
    }
  }

  ngOnInit() {
    this.auth.user$.subscribe(
      (profile) => {
        this.profileJson = JSON.stringify(profile, null, 2);
        console.log({ profile });
      }
    );
  }


}


