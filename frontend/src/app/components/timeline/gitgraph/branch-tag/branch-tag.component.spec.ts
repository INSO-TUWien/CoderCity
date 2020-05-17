import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchTagComponent } from './branch-tag.component';

describe('BranchTagComponent', () => {
  let component: BranchTagComponent;
  let fixture: ComponentFixture<BranchTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
