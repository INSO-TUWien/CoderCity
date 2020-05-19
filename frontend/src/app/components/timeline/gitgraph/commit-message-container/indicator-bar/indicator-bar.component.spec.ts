import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorBarComponent } from './indicator-bar.component';

describe('IndicatorBarComponent', () => {
  let component: IndicatorBarComponent;
  let fixture: ComponentFixture<IndicatorBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicatorBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
