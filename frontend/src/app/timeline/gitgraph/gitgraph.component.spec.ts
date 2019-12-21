import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GitgraphComponent } from './gitgraph.component';

describe('GitgraphComponent', () => {
  let component: GitgraphComponent;
  let fixture: ComponentFixture<GitgraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GitgraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GitgraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
