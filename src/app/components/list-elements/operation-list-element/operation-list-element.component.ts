import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BudgetOperation } from 'src/app/models/BudgetOperation';
import { CreateNewOperationDialogComponent } from '../../dialogs/create-new-operation-dialog/create-new-operation-dialog.component';

export interface modifyOperationEvent {
  old: BudgetOperation;
  new: BudgetOperation;
}

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
  onModify: EventEmitter<modifyOperationEvent> = new EventEmitter<modifyOperationEvent>();




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


  modifyOperation(operation: BudgetOperation) {
    let dialogRef = this.dialog.open(CreateNewOperationDialogComponent, { width: '500px', data: BudgetOperation.getCopy(operation) });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        let x: modifyOperationEvent = {
          old: this.op,
          new: result
        }
        this.onModify.emit(x);
      }
    })
  }

}
