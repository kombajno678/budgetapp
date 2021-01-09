import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionChartCardComponent } from './prediction-chart-card.component';

describe('PredictionChartCardComponent', () => {
  let component: PredictionChartCardComponent;
  let fixture: ComponentFixture<PredictionChartCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredictionChartCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictionChartCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
