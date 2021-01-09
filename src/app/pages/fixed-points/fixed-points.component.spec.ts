import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedPointsComponent } from './fixed-points.component';

describe('FixedPointsComponent', () => {
  let component: FixedPointsComponent;
  let fixture: ComponentFixture<FixedPointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
