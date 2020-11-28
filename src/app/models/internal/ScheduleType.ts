export enum ScheduleType {
  daily,
  weekly,
  monthly,
  annually
}

export function getScheduleTypeName(type: ScheduleType) {
  switch (type) {
    case ScheduleType.daily:
      return 'Daily';
    case ScheduleType.weekly:
      return 'Weekly';
    case ScheduleType.monthly:
      return 'Monthly';
    case ScheduleType.annually:
      return 'Annually';
    default:
      return '';
  }

}