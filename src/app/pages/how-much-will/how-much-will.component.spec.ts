import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowMuchWillComponent } from './how-much-will.component';

describe('HowMuchWillComponent', () => {
  let component: HowMuchWillComponent;
  let fixture: ComponentFixture<HowMuchWillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowMuchWillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowMuchWillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
