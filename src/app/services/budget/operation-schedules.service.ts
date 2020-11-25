import { Injectable } from '@angular/core';
import { ResourceServiceInterface } from './ResourceServiceInterface';
import { OperationSchedule } from 'src/app/models/OperationSchedule';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AbstractResourceService } from './abstract-resource.service';

const pathSuffix = '/users/0/schedules';
const customMap = (resource) => resource;

@Injectable({
  providedIn: 'root'
})
export class OperationSchedulesService extends AbstractResourceService<OperationSchedule> {


  constructor(public http: HttpClient) {
    super(pathSuffix, customMap, http);
  }

}
