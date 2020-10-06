import { Component, OnInit } from '@angular/core';
import { faSlidersH, faFilter } from '@fortawesome/free-solid-svg-icons';
import { faFolder } from '@fortawesome/free-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsPanelComponent } from '../settings-panel/settings-panel.component';
import { VisualizationService } from 'src/app/store/visualization/visualization.service';
import { ProjectChooserComponent } from '../project-chooser/project-chooser.component';

@Component({
  selector: 'cc-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit {

  faSlidersH = faSlidersH;
  faFilter = faFilter;
  faFolder = faFolder;

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

  openProject() {
    this.visualizationService.openProject();
  }

  onTriggerFilter() {
    this.visualizationService.setIsFilterViewActive(true);
  }
}
