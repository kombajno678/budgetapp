import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { getScheduleTypeName, ScheduleType } from 'src/app/models/internal/ScheduleType';
import { VerboseDateStuff } from 'src/app/models/internal/VerboseDateStuff';
import { ScheduledBudgetOperation } from 'src/app/models/ScheduledBudgetOperation';

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
  public displayButton: boolean = true;

  @Output()
  onDelete: EventEmitter<ScheduledBudgetOperation> = new EventEmitter<ScheduledBudgetOperation>();

  @Output()
  onModify: EventEmitter<ScheduledBudgetOperation> = new EventEmitter<ScheduledBudgetOperation>();

  @Output()
  onChangeActiveState: EventEmitter<ScheduledBudgetOperation> = new EventEmitter<ScheduledBudgetOperation>();


  months = VerboseDateStuff.months;
  daysOfWeek = VerboseDateStuff.daysOfWeek;
  daysOfMonth = VerboseDateStuff.daysOfMonth;



  constructor() {
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
          let d = this.daysOfWeek.filter(d => this.so.schedule.day_of_week.includes(d.value)).map(d => d.display);
          msg = msg + ' (' + d + ')';
          break;
        case ScheduleType.monthly:
          let m = this.so.schedule.day_of_month;
          msg = msg + ' (' + m + ')';
          break;
        case ScheduleType.annually:
          let am = this.so.schedule.day_of_month;
          let amm = this.months.filter(m => this.so.schedule.month.includes(m.value)).map(m => m.display);
          msg = msg + ' (' + am + '; ' + amm + ')';
          break;
      }
    }

    return msg;
  }

}
