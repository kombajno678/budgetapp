import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateNewFixedPointDialogComponent } from 'src/app/components/dialogs/create-new-fixed-point-dialog/create-new-fixed-point-dialog.component';
import { FixedPoint } from 'src/app/models/FixedPoint';
import { FixedPointsService } from 'src/app/services/budget/fixed-points.service';

@Component({
  templateUrl: './quick-start.component.html',
  styleUrls: ['./quick-start.component.scss']
})
export class QuickStartComponent implements OnInit {


  createdFixedPoint: FixedPoint = null;

  constructor(
    private dialog: MatDialog,
    private fixedPointsService: FixedPointsService,
    private router: Router


  ) { }

  ngOnInit(): void {
    this.fixedPointsService.getLatest().subscribe(latest => this.createdFixedPoint = latest);

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

    let dialogRef = this.dialog.open(CreateNewFixedPointDialogComponent, { width: '100%', data: FixedPoint.getCopy(fp) });

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
    let dialogRef = this.dialog.open(CreateNewFixedPointDialogComponent, { width: '100%' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let new_fixedPoint: FixedPoint = result;
        this.fixedPointsService.create(new_fixedPoint).subscribe(r => {
          if (r) {
            this.createdFixedPoint = r;
          }
          console.log('result od add new_fixedPoint = ', r);
        })
      }
    })



  }

}


