import { AbstractResource } from './AbstractResource';



export class Category extends AbstractResource {
    user_id: number;
    timestamp: any;

    name: string;
    icon: string;
    color: string;
}