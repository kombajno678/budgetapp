import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledOperationsComponent } from './scheduled-operations.component';

describe('ScheduledOperationsComponent', () => {
  let component: ScheduledOperationsComponent;
  let fixture: ComponentFixture<ScheduledOperationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledOperationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
