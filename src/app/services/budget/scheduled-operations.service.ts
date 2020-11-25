import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ScheduledBudgetOperation } from 'src/app/models/ScheduledBudgetOperation';
import { AbstractResourceService } from './abstract-resource.service';

const pathSuffix = '/users/0/scheduled_operations';
const customMap = (resource) => resource;

@Injectable({
  providedIn: 'root'
})
export class ScheduledOperationsService extends AbstractResourceService<ScheduledBudgetOperation> {


  constructor(public http: HttpClient) {
    super(pathSuffix, customMap, http);
  }

}
