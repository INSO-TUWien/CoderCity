import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorPanelComponent } from './author-panel.component';

describe('AuthorPanelComponent', () => {
  let component: AuthorPanelComponent;
  let fixture: ComponentFixture<AuthorPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
