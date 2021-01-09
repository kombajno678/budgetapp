import { AbstractResource } from './AbstractResource';



export class Category extends AbstractResource {
    user_id: number;
    timestamp: any;

    name: string;
    icon: string;
    color: string;


    static getCopy(obj: Category): any {
        let copy = new Category();
        copy.id = obj.id;
        copy.user_id = obj.user_id;
        copy.timestamp = obj.timestamp;
        copy.name = obj.name;
        copy.icon = obj.icon;
        copy.color = obj.color;
        return copy;
    }


}