import { AbstractResource } from './AbstractResource';


export class FixedPoint extends AbstractResource {


    //id: number;
    user_id: number;
    timestamp: Date;
    when: Date;
    exact_value: number;

    constructor() {
        super();
        //this.id = null;
        this.user_id = null;
        this.timestamp = null;
        this.when = null;
        this.exact_value = null;
    }


    static getCopy(fp: FixedPoint): any {
        let copy = new FixedPoint();
        copy.id = fp.id;
        copy.user_id = fp.user_id;
        copy.timestamp = fp.timestamp;
        copy.when = fp.when;
        copy.exact_value = fp.exact_value;
        return copy;
    }

}