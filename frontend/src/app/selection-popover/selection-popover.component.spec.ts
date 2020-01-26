import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionPopoverComponent } from './selection-popover.component';

describe('SelectionPopoverComponent', () => {
  let component: SelectionPopoverComponent;
  let fixture: ComponentFixture<SelectionPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
