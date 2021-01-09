
export class VerboseDateStuff {
    static months = [
        { value: 1, display: 'Januray' },
        { value: 2, display: 'February' },
        { value: 3, display: 'March' },
        { value: 4, display: 'April' },
        { value: 5, display: 'May' },
        { value: 6, display: 'June' },
        { value: 7, display: 'July' },
        { value: 8, display: 'August' },
        { value: 9, display: 'September' },
        { value: 10, display: 'October' },
        { value: 11, display: 'November' },
        { value: 12, display: 'December' }
    ];
    static daysOfWeek = [
        { value: 1, display: 'Monday' },
        { value: 2, display: 'Tuesday' },
        { value: 3, display: 'Wednesday' },
        { value: 4, display: 'Thursday' },
        { value: 5, display: 'Friday' },
        { value: 6, display: 'Saturday' },
        { value: 0, display: 'Sunday' }
    ];

    static daysOfMonth = Array.from(Array(31), (_, x) => x + 1);
}
