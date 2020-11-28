export class Globals {



    static getDaysInRange = function (startDate: Date, endDate: Date) {
        let daysRange = [];
        for (var d = new Date(startDate); d <= endDate; d.setDate(d.getUTCDate() + 1)) {
            d.setUTCHours(0, 0, 0, 0);
            daysRange.push(new Date(d));
        }
        return daysRange;
    }
    static compareDates(d1: Date, d2: Date) {
        return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
    }


}