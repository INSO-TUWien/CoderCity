import { Component, OnInit } from '@angular/core';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'cc-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit {

  faSlidersH = faSlidersH;

  constructor() { }

  ngOnInit() {
  }

}
