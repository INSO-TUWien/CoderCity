import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { BranchTag } from '../state/gitgraph.query';
import { Branch } from 'src/app/model/branch.model';

@Component({
  selector: 'cc-branch-tag',
  templateUrl: './branch-tag.component.html',
  styleUrls: ['./branch-tag.component.scss']
})
export class BranchTagComponent implements OnInit {

  @Input()
  branch: BranchTag;

  @ViewChild('label', {static: false})
  label: ElementRef<HTMLElement>;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const element = this.label.nativeElement;
    if (element != null) {
      element.id = Branch.hashCode(this.branch);
    }
  }

}
