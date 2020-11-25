import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractResourceService } from './abstract-resource.service';
import { BudgetOperation } from 'src/app/models/BudgetOperation';

const pathSuffix = '/users/0/operations';


const customMap = (resource) => {
  //console.log('custom map');
  resource.forEach(op => {
    op.when = new Date(op.when);
    //console.log(fp.when);
  });
  resource.sort((a, b) => a.when.getTime() - b.when.getTime());
  return resource
};

@Injectable({
  providedIn: 'root'
})
export class BudgetOperationService extends AbstractResourceService<BudgetOperation> {
  constructor(public http: HttpClient) {
    super(pathSuffix, customMap, http);
  }
}
