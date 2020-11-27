import { InvokeFunctionExpr } from '@angular/compiler';
import { AbstractResource } from './AbstractResource';
import { ScheduleType } from './internal/ScheduleType';

export class OperationSchedule extends AbstractResource {

    //id?: number;
    user_id?: number;
    timestamp?: Date;

    year?: number[];
    month?: number[];
    day_of_month?: number[];
    day_of_week?: number[];

    scheduleType?: ScheduleType;

    constructor(
        user_id: number = null,
        timestamp: any = null,
        year: number[] = [],
        month: number[] = [],
        day_of_month: number[] = [],
        day_of_week: number[] = [],
    ) {
        super();
        //this.id = null;
        this.user_id = user_id;
        this.timestamp = timestamp;
        this.year = year;
        this.month = month;
        this.day_of_month = day_of_month;
        this.day_of_week = day_of_week;

        OperationSchedule.initScheduleType(this);


    }

    static initScheduleType(schedule: OperationSchedule): void {
        if (
            schedule.year.length === 0 &&
            schedule.month.length === 0 &&
            schedule.day_of_month.length === 0 &&
            schedule.day_of_week.length === 0
        ) {
            // if all arrays empty -> daily
            schedule.scheduleType = ScheduleType.daily;
        } else if (
            schedule.year.length === 0 &&
            schedule.month.length === 0 &&
            schedule.day_of_month.length === 0 &&
            schedule.day_of_week.length > 0
        ) {
            // if only day of week -> weekly
            schedule.scheduleType = ScheduleType.weekly;
        } else if (
            schedule.year.length === 0 &&
            schedule.month.length === 0 &&
            schedule.day_of_month.length > 0 &&
            schedule.day_of_week.length === 0
        ) {
            // if only day of month -> monthly
            schedule.scheduleType = ScheduleType.monthly;
        } else if (
            schedule.year.length === 0 &&
            schedule.month.length > 0 &&
            schedule.day_of_month.length > 0 &&
            schedule.day_of_week.length === 0
        ) {
            // if both month and day of month -> annualy
            schedule.scheduleType = ScheduleType.annually;
        }
    }

    private static areNumberArraysEqual(x: number[], y: number[]): boolean {
        if (x.length !== y.length) {
            return false;
        } else {
            if (x.length === 0) {
                return true;
            }
            let x_sorted = x.sort((a, b) => b - a);
            let y_sorted = y.sort((a, b) => b - a);
            for (let i = 0; i < x.length; i++) {
                if (x_sorted[i] !== y_sorted[i]) {
                    return false;
                }
            }
        }
        return true;
    }

    static areEqual(s1: OperationSchedule, s2: OperationSchedule): boolean {
        if (!s1 || !s2) {
            return false;
        }
        return this.areNumberArraysEqual(s1.day_of_month, s2.day_of_month) &&
            this.areNumberArraysEqual(s1.day_of_week, s2.day_of_week) &&
            this.areNumberArraysEqual(s1.month, s2.month) &&
            this.areNumberArraysEqual(s1.year, s2.year);
    }


    static getCopy(original: OperationSchedule): OperationSchedule {
        let copy = new OperationSchedule(
            original.user_id,
            original.timestamp,
            original.year,
            original.month,
            original.day_of_month,
            original.day_of_week,
        );
        return copy;
    }


}
