import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectChooserComponent } from './project-chooser.component';

describe('ProjectChooserComponent', () => {
  let component: ProjectChooserComponent;
  let fixture: ComponentFixture<ProjectChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
