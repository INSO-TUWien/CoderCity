import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchNameContainerComponent } from './branch-name-container.component';

describe('BranchNameContainerComponent', () => {
  let component: BranchNameContainerComponent;
  let fixture: ComponentFixture<BranchNameContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchNameContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchNameContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
