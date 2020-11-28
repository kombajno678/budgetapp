import { BudgetOperation } from '../BudgetOperation';
import { FixedPoint } from '../FixedPoint';

export class PredicionPoint {


    date: Date;
    value: number;

    fixedPoint?: FixedPoint;
    operations?: BudgetOperation[] = [];
    delta?: number;

    constructor(date: Date, value: number, fixedPoint: FixedPoint = null, operations: BudgetOperation[] = [], delta: number = null) {
        this.date = date;
        this.value = value;
        this.fixedPoint = fixedPoint;
        this.operations = operations;
        this.delta = delta;
    }

}