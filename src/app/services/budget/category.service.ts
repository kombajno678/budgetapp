import { Injectable } from '@angular/core';
import { Category } from '../../models/Category';

import { HttpClient } from '@angular/common/http';
import { AbstractResourceService } from './abstract-resource.service';
import { BudgetService } from './budget.service';
import { UserService } from './user.service';

const pathSuffix = '/users/0/categories';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends AbstractResourceService<Category> {

  static customMap() {
    return (resource: Category[]) => {
      return resource
    };
  }


  constructor(public http: HttpClient, public userService:UserService) {
    super(pathSuffix, CategoryService.customMap(), http, userService);


  }
}
