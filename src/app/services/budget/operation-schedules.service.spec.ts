import { TestBed } from '@angular/core/testing';

import { OperationSchedulesService } from './operation-schedules.service';

describe('OperationSchedulesService', () => {
  let service: OperationSchedulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationSchedulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
