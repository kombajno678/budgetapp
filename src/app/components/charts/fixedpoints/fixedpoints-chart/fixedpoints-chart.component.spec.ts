import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedpointsChartComponent } from './fixedpoints-chart.component';

describe('FixedpointsChartComponent', () => {
  let component: FixedpointsChartComponent;
  let fixture: ComponentFixture<FixedpointsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedpointsChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedpointsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
