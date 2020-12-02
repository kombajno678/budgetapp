import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateNewFixedPointDialogComponent } from 'src/app/components/dialogs/create-new-fixed-point-dialog/create-new-fixed-point-dialog.component';
import { FixedPoint } from 'src/app/models/FixedPoint';
import { BudgetService } from 'src/app/services/budget/budget.service';
import { FixedPointsService } from 'src/app/services/budget/fixed-points.service';

@Component({
  templateUrl: './quick-start.component.html',
  styleUrls: ['./quick-start.component.scss']
})
export class QuickStartComponent implements OnInit {


  createdFixedPoint: FixedPoint = null;

  n: number = null;

  constructor(
    private dialog: MatDialog,
    private fixedPointsService: FixedPointsService,
    private router: Router,
    private budget: BudgetService,


  ) { }

  ngOnInit(): void {
    this.fixedPointsService.getLatest().subscribe(latest => this.createdFixedPoint = latest);

  }

  check() {
    this.budget.checkIfNeedToGenerateOperations().subscribe(n => {
      this.n = n;
      console.log('need to generate ' + n + ' operations')
    })
  }

  goToHome() {
    this.router.navigate(['/']);
  }
  goToOperations() {
    this.router.navigate(['/operations']);

  }

  deleteFixedPoint(fp: FixedPoint) {

    this.fixedPointsService.delete(fp).subscribe(r => {
      console.log('delete result = ', r);
    });
    this.fixedPointsService.getLatest().subscribe(latest => this.createdFixedPoint = latest);


  }
  modifyFixedPoint(fp: FixedPoint) {

    //open dialog

    let dialogRef = this.dialog.open(CreateNewFixedPointDialogComponent, { width: '500px', data: FixedPoint.getCopy(fp) });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let modified_fixedPoint: FixedPoint = result;

        this.fixedPointsService.update(modified_fixedPoint).subscribe(r => {
          console.log('result of modify = ', r);
        })
      }
    })

  }
  addFixedPoint() {



    //open dialog for creating new operation
    let dialogRef = this.dialog.open(CreateNewFixedPointDialogComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let new_fixedPoint: FixedPoint = result;
        this.fixedPointsService.create(new_fixedPoint).subscribe(r => {
          if (r) {
            this.createdFixedPoint = r;
            this.createdFixedPoint.when = new Date(this.createdFixedPoint.when);
          }
          console.log('result od add new_fixedPoint = ', r);
        })
      }
    })



  }

}


