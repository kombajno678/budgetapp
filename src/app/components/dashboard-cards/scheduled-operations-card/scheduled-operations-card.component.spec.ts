import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledOperationsCardComponent } from './scheduled-operations-card.component';

describe('ScheduledOperationsCardComponent', () => {
  let component: ScheduledOperationsCardComponent;
  let fixture: ComponentFixture<ScheduledOperationsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledOperationsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledOperationsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
