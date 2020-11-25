import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CreateNewFixedPointDialogComponent } from 'src/app/components/dialogs/create-new-fixed-point-dialog/create-new-fixed-point-dialog.component';
import { FixedPoint } from 'src/app/models/FixedPoint';
import { FixedPointsService } from 'src/app/services/budget/fixed-points.service';

@Component({
  templateUrl: './fixed-points.component.html',
  styleUrls: ['./fixed-points.component.scss']
})
export class FixedPointsComponent implements OnInit {

  constructor(private fixedPointsService: FixedPointsService, private dialog: MatDialog) { }

  fixedPoints: FixedPoint[];

  fixedPoints$: Observable<FixedPoint[]>;



  ngOnInit(): void {
    this.fixedPoints$ = this.fixedPointsService.getAll();
    this.fixedPoints$.subscribe(r => this.fixedPoints = r ? r : null);

  }


  add() {
    //open dialog for creating new operation
    let dialogRef = this.dialog.open(CreateNewFixedPointDialogComponent, { width: '100%' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let new_fixedPoint: FixedPoint = result;
        this.fixedPointsService.create(new_fixedPoint).subscribe(r => {
          console.log('result od add new_fixedPoint = ', r);
        })
      }
    })
  }

  modify(fp: FixedPoint) {

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

  delete(fp: FixedPoint) {
    this.fixedPointsService.delete(fp).subscribe(r => {
      console.log('delete result = ', r);
    })
  }

  getDateString(when: string | Date) {
    if (when instanceof Date) {
      return when.toISOString().substr(0, 10);
    } else {
      return new Date(when).toISOString().substr(0, 10);
    }
  }


}
