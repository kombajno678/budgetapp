import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedPointListElementComponent } from './fixed-point-list-element.component';

describe('FixedPointListElementComponent', () => {
  let component: FixedPointListElementComponent;
  let fixture: ComponentFixture<FixedPointListElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedPointListElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedPointListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
