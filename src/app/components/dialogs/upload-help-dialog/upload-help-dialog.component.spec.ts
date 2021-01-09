import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadHelpDialogComponent } from './upload-help-dialog.component';

describe('UploadHelpDialogComponent', () => {
  let component: UploadHelpDialogComponent;
  let fixture: ComponentFixture<UploadHelpDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadHelpDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
