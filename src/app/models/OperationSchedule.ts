import { InvokeFunctionExpr } from '@angular/compiler';

export class OperationSchedule {

    id?: number;
    user_id?: number;
    timestamp?: Date;

    year?: number[];
    month?: number[];
    day_of_month?: number[];
    day_of_week?: number[];


    constructor() {
        this.id = null;
        this.user_id = null;
        this.timestamp = null;
        this.year = [];
        this.month = [];
        this.day_of_month = [];
        this.day_of_week = [];
    }

    private static areNumberArraysEqual(x: number[], y: number[]): boolean {
        if (x.length !== y.length) {
            return false;
        } else {
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
        if (!s1 || !s2)
            return this.areNumberArraysEqual(s1.day_of_month, s2.day_of_month) &&
                this.areNumberArraysEqual(s1.day_of_week, s2.day_of_week) &&
                this.areNumberArraysEqual(s1.month, s2.month) &&
                this.areNumberArraysEqual(s1.year, s2.year);
    }


}
