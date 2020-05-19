import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorLabelComponent } from './author-label.component';

describe('AuthorLabelComponent', () => {
  let component: AuthorLabelComponent;
  let fixture: ComponentFixture<AuthorLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
