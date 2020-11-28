import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledOperationListElementComponent } from './scheduled-operation-list-element.component';

describe('ScheduledOperationListElementComponent', () => {
  let component: ScheduledOperationListElementComponent;
  let fixture: ComponentFixture<ScheduledOperationListElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledOperationListElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledOperationListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
