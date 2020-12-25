import { PredictionPoint } from "./models/internal/PredictionPoint";

export class Globals {



    static getDaysInRange = function (startDate: Date, endDate: Date) {
        let daysRange = [];
        for (var d = new Date(startDate); d <= endDate; d.setDate(d.getUTCDate() + 1)) {
            d.setUTCHours(12, 0, 0, 0);
            daysRange.push(new Date(d));
        }
        return daysRange;
    }
    static compareDates(d1: Date, d2: Date) {
        return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
    }

    static daysDifference(d1: Date, d2: Date) {
        return (d1.getTime() - d2.getTime()) / (3600000 * 24);
    }

    private static pad(x:number, n:number):string{
        return `${'0'.repeat(n - (''+x).length)}${x}`

    }

    public static toStr(d:Date, del:string = '-'):string{
        return `${d.getFullYear()}${del}${Globals.pad(d.getMonth(), 2)}${del}${Globals.pad(d.getDate(), 2)}`;
    }

    static displayValue(p: PredictionPoint | number, digits: number = 2) {

        if (p instanceof PredictionPoint) {
            return p.value.toLocaleString(
                undefined, // leave undefined to use the browser's locale,
                // or use a string like 'en-US' to override it.
                {
                    maximumFractionDigits: digits,
                    minimumFractionDigits: digits
                }
            );


        } else {
            return p.toLocaleString(
                undefined, // leave undefined to use the browser's locale,
                // or use a string like 'en-US' to override it.
                {
                    maximumFractionDigits: digits,
                    minimumFractionDigits: digits
                }
            );;

        }

    }


}