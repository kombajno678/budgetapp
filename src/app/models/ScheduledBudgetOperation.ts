import { AbstractResource } from './AbstractResource';
import { Category } from './Category'
import { ScheduleType } from './internal/ScheduleType';
export class ScheduledBudgetOperation extends AbstractResource {

    //id?: number;
    user_id?: number;
    name?: string;
    value?: number;
    timestamp?: Date;
    active?: boolean;// when false then wont generate new operations
    hidden?: boolean;//true when deleted
    category_id?: number;

    year?: number[];
    month?: number[];
    day_of_month?: number[];
    day_of_week?: number[];

    category?: Category;
    scheduleType?: ScheduleType;



    constructor(user_id: number = null, schedule_id: number = null) {
        super();
        this.user_id = user_id;

        ScheduledBudgetOperation.initScheduleType(this);
    }

    static getCopy(original: ScheduledBudgetOperation) {
        let copy = new ScheduledBudgetOperation();
        copy.id = original.id;
        copy.user_id = original.user_id;
        copy.name = original.name;
        copy.value = original.value;
        copy.year = original.year;
        copy.month = original.month;
        copy.day_of_month = original.day_of_month;
        copy.day_of_week = original.day_of_week;
        copy.timestamp = original.timestamp;
        return copy;
    }




    static matchSceduleWithDate(sop: ScheduledBudgetOperation, date: Date): boolean {
        if (!sop.scheduleType) {
            ScheduledBudgetOperation.initScheduleType(sop);
        }
        switch (sop.scheduleType) {
            case ScheduleType.daily:
                //scheduled operation is on daily schedule, 
                return true;
            case ScheduleType.weekly:
                //check day of week
                return (sop.day_of_week.includes(date.getDay()));
            case ScheduleType.monthly:
                //check day of month
                return (sop.day_of_month.includes(date.getDate()));
            case ScheduleType.annually:
                //check day of month and month
                return (sop.day_of_month.includes(date.getDate()) && sop.month.includes(date.getMonth()));
            default:
                return false;
        }
    }



    static initScheduleType(sop: ScheduledBudgetOperation): void {
        if (!sop.year) {
            sop.year = [];
        }
        if (!sop.month) {
            sop.month = [];
        }
        if (!sop.day_of_month) {
            sop.day_of_month = [];
        }
        if (!sop.day_of_week) {
            sop.day_of_week = [];
        }


        if (
            (!sop.year || sop.year?.length === 0) &&
            (!sop.month || sop.month?.length === 0) &&
            (!sop.day_of_month || sop.day_of_month?.length === 0) &&
            (!sop.day_of_week || sop.day_of_week?.length === 0)
        ) {
            // if all arrays empty -> daily
            sop.scheduleType = ScheduleType.daily;
        } else if (
            sop.year?.length === 0 &&
            sop.month?.length === 0 &&
            sop.day_of_month?.length === 0 &&
            sop.day_of_week?.length > 0
        ) {
            // if only day of week -> weekly
            sop.scheduleType = ScheduleType.weekly;
        } else if (
            sop.year?.length === 0 &&
            sop.month?.length === 0 &&
            sop.day_of_month?.length > 0 &&
            sop.day_of_week?.length === 0
        ) {
            // if only day of month -> monthly
            sop.scheduleType = ScheduleType.monthly;
        } else if (
            sop.year?.length === 0 &&
            sop.month?.length > 0 &&
            sop.day_of_month?.length > 0 &&
            sop.day_of_week?.length === 0
        ) {
            // if both month and day of month -> annualy
            sop.scheduleType = ScheduleType.annually;
        } else {
            sop.scheduleType = null;
        }
    }





    //schedule:OperationSchedule;

}