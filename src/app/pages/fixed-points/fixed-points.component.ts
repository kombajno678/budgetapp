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
    this.fixedPoints$.subscribe(r => {
      if (r) {
        console.log('received fixed points = ', r);
        this.fixedPoints = r;

      }
    });

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


  }

  delete(fp: FixedPoint) {
    
  }

  


}
