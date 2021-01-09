import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsCardComponent } from './operations-card.component';

describe('OperationsCardComponent', () => {
  let component: OperationsCardComponent;
  let fixture: ComponentFixture<OperationsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
