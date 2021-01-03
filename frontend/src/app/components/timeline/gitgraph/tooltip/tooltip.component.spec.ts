import { async, ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<< HEAD:frontend/src/app/components/timeline/gitgraph/branch-tag/branch-tag.component.spec.ts
import { BranchTagComponent } from './branch-tag.component';

describe('BranchTagComponent', () => {
  let component: BranchTagComponent;
  let fixture: ComponentFixture<BranchTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchTagComponent ]
=======
import { TooltipComponent } from './tooltip.component';

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TooltipComponent ]
>>>>>>> master:frontend/src/app/components/timeline/gitgraph/tooltip/tooltip.component.spec.ts
    })
    .compileComponents();
  }));

  beforeEach(() => {
<<<<<<< HEAD:frontend/src/app/components/timeline/gitgraph/branch-tag/branch-tag.component.spec.ts
    fixture = TestBed.createComponent(BranchTagComponent);
=======
    fixture = TestBed.createComponent(TooltipComponent);
>>>>>>> master:frontend/src/app/components/timeline/gitgraph/tooltip/tooltip.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
