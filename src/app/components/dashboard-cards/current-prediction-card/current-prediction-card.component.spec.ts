import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPredictionCardComponent } from './current-prediction-card.component';

describe('CurrentPredictionCardComponent', () => {
  let component: CurrentPredictionCardComponent;
  let fixture: ComponentFixture<CurrentPredictionCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentPredictionCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentPredictionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
