import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/Globals';
import { BudgetOperation } from 'src/app/models/BudgetOperation';
import { modifyEvent } from 'src/app/models/internal/modifyEvent';
import { CreateNewOperationDialogComponent } from '../../dialogs/create-new-operation-dialog/create-new-operation-dialog.component';

@Component({
  selector: 'app-operation-list-element',
  templateUrl: './operation-list-element.component.html',
  styleUrls: ['./operation-list-element.component.scss']
})
export class OperationListElementComponent implements OnInit, OnDestroy {


  @Input()
  op: BudgetOperation;

  @Input()
  public displayButton: boolean = true;
  @Input()
  public compact: boolean;

  @Output()
  onDelete: EventEmitter<BudgetOperation> = new EventEmitter<BudgetOperation>();

  @Output()
  onModify: EventEmitter<modifyEvent<BudgetOperation>> = new EventEmitter<modifyEvent<BudgetOperation>>();


  displayValue = Globals.displayValue;


  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {

  }


  ngOnDestroy(): void {
    this.op = null;
    this.onDelete = null;
    this.onModify = null;
  }


  test() {
    console.log('button clickd');
  }


  modify() {
    let dialogRef = this.dialog.open(CreateNewOperationDialogComponent, { width: '500px', data: BudgetOperation.getCopy(this.op) });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        let x: modifyEvent<BudgetOperation> = {
          old: this.op,
          new: result
        }
        this.onModify.emit(x);
      }
    })
  }

}
