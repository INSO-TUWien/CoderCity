import { Component, OnInit } from '@angular/core';
import { faSlidersH, faFilter } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsPanelComponent } from '../settings-panel/settings-panel.component';
import { VisualizationService } from 'src/app/services/visualization.service';

@Component({
  selector: 'cc-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit {

  faSlidersH = faSlidersH;
  faFilter = faFilter;

  constructor(
    private modalService: NgbModal,
    private visualizationService: VisualizationService
  ) {

  }

  ngOnInit() {
  }

  openModal() {
    this.modalService.open(SettingsPanelComponent);
  }

  onTriggerFilter() {
    this.visualizationService.setIsFilterViewActive(true);
  }
}
