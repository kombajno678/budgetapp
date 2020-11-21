import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewFixedPointDialogComponent } from './create-new-fixed-point-dialog.component';

describe('CreateNewFixedPointDialogComponent', () => {
  let component: CreateNewFixedPointDialogComponent;
  let fixture: ComponentFixture<CreateNewFixedPointDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewFixedPointDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewFixedPointDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
