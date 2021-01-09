import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FixedPoint } from 'src/app/models/FixedPoint';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { AbstractResourceService } from './abstract-resource.service';
import { BudgetService } from './budget.service';
import { UserService } from './user.service';


const customMap = (resource) => {
  //console.log('custom map');
  resource.forEach(fp => {
    fp.when = new Date(fp.when);
    //console.log(fp.when);
  });
  resource.sort((a, b) => a.when.getTime() - b.when.getTime());
  return resource
};

const pathSuffix = '/users/0/fixed_points';

@Injectable({
  providedIn: 'root'
})
export class FixedPointsService extends AbstractResourceService<FixedPoint> {
  constructor(public http: HttpClient, public userService:UserService) {
    super(pathSuffix, customMap, http, userService);
  }

  getLatest() {
    return this.getAllOnce().pipe(
      map(fps => {
        let latestFixedPoint = null;
        fps?.forEach(fp => {
          if (!latestFixedPoint) {
            latestFixedPoint = fp;
          } else {
            //if fp date newer than latestFixedPoint date then replace
            if (fp.when > latestFixedPoint.when) {
              latestFixedPoint = fp;
            }
          }
        })
        return latestFixedPoint;
      })
    )
  }
}
