import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhenWillComponent } from './when-will.component';

describe('WhenWillComponent', () => {
  let component: WhenWillComponent;
  let fixture: ComponentFixture<WhenWillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhenWillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhenWillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
