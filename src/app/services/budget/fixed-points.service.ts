import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FixedPoint } from 'src/app/models/FixedPoint';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AbstractResourceService } from './abstract-resource.service';

@Injectable({
  providedIn: 'root'
})
export class FixedPointsService extends AbstractResourceService<FixedPoint> {

  //pathSuffix = '/users/0/fixed_points';

  constructor(http: HttpClient) {
    super('/users/0/fixed_points', http);
  }

}
