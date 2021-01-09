import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/Globals';
import { FixedPoint } from 'src/app/models/FixedPoint';
import { FixedPointsService } from 'src/app/services/budget/fixed-points.service';
import { CreateNewFixedPointDialogComponent } from '../../dialogs/create-new-fixed-point-dialog/create-new-fixed-point-dialog.component';

@Component({
  selector: 'app-fixed-point-list-element',
  templateUrl: './fixed-point-list-element.component.html',
  styleUrls: ['./fixed-point-list-element.component.scss']
})
export class FixedPointListElementComponent implements OnInit {

  @Input()
  fp:FixedPoint;

  getDateString = Globals.toStr;

  @Output()
  onModify:EventEmitter<void> = new EventEmitter<void>();

  @Output()
  onDelete:EventEmitter<void> = new EventEmitter<void>();


  constructor(private fixedPointsService: FixedPointsService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  modify(fp: FixedPoint) {

    //open dialog

    let dialogRef = this.dialog.open(CreateNewFixedPointDialogComponent, { width: '100%', data: FixedPoint.getCopy(fp) });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let modified_fixedPoint: FixedPoint = result;
        this.fixedPointsService.update(modified_fixedPoint).subscribe(r => {
          console.log('result of modify = ', r);
          this.onModify.emit();
          this.fp = modified_fixedPoint;
        })
      }
    })
  }

  delete(fp: FixedPoint) {
    this.fixedPointsService.delete(fp).subscribe(r => {
      console.log('delete result = ', r);
      this.onDelete.emit();
    })
  }




}
