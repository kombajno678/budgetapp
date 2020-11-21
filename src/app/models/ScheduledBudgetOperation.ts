import { OperationSchedule } from './OperationSchedule';

export class ScheduledBudgetOperation {

    id?: number;
    user_id?: number;
    name?: string;
    value?: number;
    schedule_id?: number;
    timestamp?: Date;

    schedule?: OperationSchedule;


    constructor() {
        this.id = null;
        this.user_id = null;
        this.schedule_id = null;
    }

    static getCopy(original: ScheduledBudgetOperation) {
        let copy = new ScheduledBudgetOperation();
        copy.id = original.id;
        copy.user_id = original.user_id;
        copy.name = original.name;
        copy.value = original.value;
        copy.schedule_id = original.schedule_id;
        copy.timestamp = original.timestamp;
        return copy;
    }


    //schedule:OperationSchedule;

}