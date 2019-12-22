import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitMessageContainerComponent } from './commit-message-container.component';

describe('CommitMessageContainerComponent', () => {
  let component: CommitMessageContainerComponent;
  let fixture: ComponentFixture<CommitMessageContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitMessageContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitMessageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
