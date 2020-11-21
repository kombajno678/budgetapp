import { Observable } from 'rxjs';

export interface ResourceService<T> {

    path: string;

    getAll(): Observable<T[]>;

    get(id: number): Observable<T>;

    delete(object: T): Observable<T>;

    update(object: T): Observable<T>;

    create(object: T): Observable<T>;

    refreshResource(): void;


}