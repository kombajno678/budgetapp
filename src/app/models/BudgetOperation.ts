import { Moment } from 'moment';
import { AbstractResource } from './AbstractResource';
import { ScheduledBudgetOperation } from './ScheduledBudgetOperation';
import { Category } from './Category'

export class BudgetOperation extends AbstractResource {

    // id?: number;
    user_id?: number;
    name?: string;
    value?: number;
    when?: Date;
    scheduled_operation_id?: number;
    category_id?: number;
    timestamp?: Date;

    scheduled_operation?: ScheduledBudgetOperation;
    category?: Category;


    constructor(name = null, value = null, when = null, scheduled_operation_id = null) {
        super();
        //this.id = null;
        this.user_id = null;

        this.name = name;
        this.value = value;
        this.when = when;
        this.scheduled_operation_id = scheduled_operation_id;

    }

    static getCopy(original: BudgetOperation) {
        let copy = new BudgetOperation();
        copy.id = original.id;
        copy.user_id = original.user_id;
        copy.name = original.name;
        copy.value = original.value;
        copy.when = original.when;
        copy.scheduled_operation_id = original.scheduled_operation_id;
        copy.timestamp = original.timestamp;
        return copy;
    }


    //schedule:OperationSchedule;

}