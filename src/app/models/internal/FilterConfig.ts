import { ScheduleType } from "./ScheduleType";

export enum OperationType{
    ANY,
    INCOME,
    EXPENSE,
   
}
export interface FilterConfig{
    operationType:OperationType,
    scheduleType?:ScheduleType[],
    showHidden?:boolean;

}