import { OperationSchedule } from './OperationSchedule';
import { AbstractResource } from './AbstractResource';
import { Category } from './Category'
export class ScheduledBudgetOperation extends AbstractResource {

    //id?: number;
    user_id?: number;
    name?: string;
    value?: number;
    schedule_id?: number;
    timestamp?: Date;
    active?: boolean;// when false then wont generate new operations
    hidden?: boolean;//true when deleted
    category_id?: number;

    schedule?: OperationSchedule;
    category?: Category;


    constructor(user_id: number = null, schedule_id: number = null) {
        super();
        this.user_id = user_id;
        this.schedule_id = schedule_id;
    }

    static getCopy(original: ScheduledBudgetOperation) {
        let copy = new ScheduledBudgetOperation();
        copy.id = original.id;
        copy.user_id = original.user_id;
        copy.name = original.name;
        copy.value = original.value;
        copy.schedule_id = original.schedule_id;
        copy.timestamp = original.timestamp;

        copy.schedule = original.schedule ? OperationSchedule.getCopy(original.schedule) : null;

        return copy;
    }


    //schedule:OperationSchedule;

}