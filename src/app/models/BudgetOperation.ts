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

    }


    //schedule:OperationSchedule;

}