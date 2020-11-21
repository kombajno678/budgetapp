export class BudgetOperation {

    id?: number;
    user_id?: number;
    name?: string;
    value?: number;
    when?: Date;
    scheduled_operation_id?: number;
    timestamp?: Date;

    constructor() {
        this.id = null;
        this.user_id = null;
        this.scheduled_operation_id = null;

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