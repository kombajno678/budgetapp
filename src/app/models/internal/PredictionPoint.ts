import { BudgetOperation } from '../BudgetOperation';
import { FixedPoint } from '../FixedPoint';

export class PredicionPoint {


    date: Date;
    value: number;

    fixedPoint?: FixedPoint;
    operations?: BudgetOperation[];

    constructor(date: Date, value: number) {
        this.date = date;
        this.value = value;
    }

}