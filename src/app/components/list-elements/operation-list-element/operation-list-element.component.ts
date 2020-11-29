import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BudgetOperation } from 'src/app/models/BudgetOperation';

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
  onModify: EventEmitter<BudgetOperation> = new EventEmitter<BudgetOperation>();




  constructor() { }

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

}
