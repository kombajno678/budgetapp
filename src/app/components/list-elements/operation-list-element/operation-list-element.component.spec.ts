import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationListElementComponent } from './operation-list-element.component';

describe('OperationListElementComponent', () => {
  let component: OperationListElementComponent;
  let fixture: ComponentFixture<OperationListElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationListElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
