import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cc-branch-name-label',
  templateUrl: './branch-name-label.component.html',
  styleUrls: ['./branch-name-label.component.scss']
})
export class BranchNameLabelComponent implements OnInit {

  @Input('title')
  title = 'Master';

  constructor() { }

  ngOnInit() {
  }

}
