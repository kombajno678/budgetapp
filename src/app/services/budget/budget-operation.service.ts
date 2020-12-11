import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractResourceService } from './abstract-resource.service';
import { BudgetOperation } from 'src/app/models/BudgetOperation';
import { ScheduledOperationsService } from './scheduled-operations.service';

const pathSuffix = '/users/0/operations';




@Injectable({
  providedIn: 'root'
})
export class BudgetOperationService extends AbstractResourceService<BudgetOperation> {

  static customMap() {
    return (resource: BudgetOperation[]) => {
      resource.forEach(op => {
        op.when = new Date(op.when);
      });
      resource.sort((a, b) => b.when.getTime() - a.when.getTime());
      return resource
    };
  }


  constructor(public http: HttpClient) {
    super(pathSuffix, BudgetOperationService.customMap(), http);


  }
}
