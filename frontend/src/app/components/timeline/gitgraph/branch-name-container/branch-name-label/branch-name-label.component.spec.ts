import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchNameLabelComponent } from './branch-name-label.component';

describe('BranchNameLabelComponent', () => {
  let component: BranchNameLabelComponent;
  let fixture: ComponentFixture<BranchNameLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchNameLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchNameLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
