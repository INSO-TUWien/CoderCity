import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeIntervalLabelComponent } from './time-interval-label.component';

describe('TimeIntervalLabelComponent', () => {
  let component: TimeIntervalLabelComponent;
  let fixture: ComponentFixture<TimeIntervalLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeIntervalLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeIntervalLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
