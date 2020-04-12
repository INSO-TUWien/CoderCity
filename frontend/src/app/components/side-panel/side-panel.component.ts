import { Component, OnInit } from '@angular/core';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsPanelComponent } from '../settings-panel/settings-panel.component';

@Component({
  selector: 'cc-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit {

  faSlidersH = faSlidersH;

  constructor(private modalService: NgbModal) {

  }

  ngOnInit() {
  }

  openModal() {
    this.modalService.open(SettingsPanelComponent);
  }
}
