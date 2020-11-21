import { TestBed } from '@angular/core/testing';

import { ScheduledOperationsService } from './scheduled-operations.service';

describe('ScheduledOperationsService', () => {
  let service: ScheduledOperationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduledOperationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
