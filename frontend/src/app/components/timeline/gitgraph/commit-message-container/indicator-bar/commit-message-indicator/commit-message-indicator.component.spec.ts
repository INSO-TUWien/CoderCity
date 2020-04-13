import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitMessageIndicatorComponent } from './commit-message-indicator.component';

describe('CommitMessageIndicatorComponent', () => {
  let component: CommitMessageIndicatorComponent;
  let fixture: ComponentFixture<CommitMessageIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitMessageIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitMessageIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
