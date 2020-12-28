import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/Globals';
import { modifyEvent } from 'src/app/models/internal/modifyEvent';
import { getScheduleTypeName, ScheduleType } from 'src/app/models/internal/ScheduleType';
import { VerboseDateStuff } from 'src/app/models/internal/VerboseDateStuff';
import { ScheduledBudgetOperation } from 'src/app/models/ScheduledBudgetOperation';
import { CreateNewScheduledOperationDialogComponent } from '../../dialogs/create-new-scheduled-operation-dialog/create-new-scheduled-operation-dialog.component';

@Component({
  selector: 'app-scheduled-operation-list-element',
  templateUrl: './scheduled-operation-list-element.component.html',
  styleUrls: ['./scheduled-operation-list-element.component.scss']
})
export class ScheduledOperationListElementComponent implements OnInit, OnDestroy {


  @Input()
  so: ScheduledBudgetOperation;

  public displayType: boolean = true;
  public displayTypeDetails: boolean = true;
  @Input()
  public displayButton: boolean = true;
  @Input()
  public compact: boolean = false;

  @Output()
  onDelete: EventEmitter<ScheduledBudgetOperation> = new EventEmitter<ScheduledBudgetOperation>();

  @Output()
  onModify: EventEmitter<modifyEvent<ScheduledBudgetOperation>> = new EventEmitter<modifyEvent<ScheduledBudgetOperation>>();

  @Output()
  onChangeActiveState: EventEmitter<ScheduledBudgetOperation> = new EventEmitter<ScheduledBudgetOperation>();


  months = VerboseDateStuff.months;
  daysOfWeek = VerboseDateStuff.daysOfWeek;
  daysOfMonth = VerboseDateStuff.daysOfMonth;

  displayValue = Globals.displayValue;

  highlighted:boolean;




  constructor(private dialog: MatDialog) {
    if (this.compact) {
      this.displayTypeDetails = false;
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.so = null;
    this.onDelete = null;
    this.onModify = null;
    this.months = null;
    this.daysOfWeek = null;
    this.daysOfMonth = null;
  }


  changeActiveState() {
    this.so.active = !this.so.active;
    this.onChangeActiveState.emit(this.so);
  }

  getScheduleTypeDescription(type: ScheduleType) {


    let msg = ''
    msg = this.displayType ? getScheduleTypeName(type) : '';

    if (this.displayTypeDetails) {
      switch (type) {
        case ScheduleType.daily:
          break;
        case ScheduleType.weekly:
          let d = this.daysOfWeek.filter(d => this.so.day_of_week.includes(d.value)).map(d => d.display);
          msg = msg + ' (' + d + ')';
          break;
        case ScheduleType.monthly:
          let m = this.so.day_of_month;
          msg = msg + ' (' + m + ')';
          break;
        case ScheduleType.annually:
          let am = this.so.day_of_month;
          let amm = this.months.filter(m => this.so.month.includes(m.value)).map(m => m.display);
          msg = msg + ' (' + am + '; ' + amm + ')';
          break;
        default:
          break;
      }
    }

    return msg;
  }

  modify() {
    let dialogRef = this.dialog.open(CreateNewScheduledOperationDialogComponent, { width: '500px', data: ScheduledBudgetOperation.getCopy(this.so) });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let x: modifyEvent<ScheduledBudgetOperation> = {
          old: this.so,
          new: result
        }
        this.onModify.emit(x);
        this.so = result;
        
        this.highlighted = true;
        setTimeout(()=> this.highlighted = false, 2000);
      }
    })

  }
}


