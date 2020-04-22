import { Component, OnInit } from '@angular/core';
import { BlameHunk } from 'src/app/model/blamehunk.model';
import { Subscription } from 'rxjs';
import { VisualizationQuery } from 'src/app/state/visualization.query';
import { IntersectableDirectory } from 'src/app/model/intersectable/intersectable-directory';

export enum InformationPanelState {
  Inactive,
  Hunk,
  Directory
}

@Component({
  selector: 'cc-information-panel',
  templateUrl: './information-panel.component.html',
  styleUrls: ['./information-panel.component.scss']
})
export class InformationPanelComponent implements OnInit {
  active: boolean = true;
  InformationPanelState = InformationPanelState;

  state: InformationPanelState = InformationPanelState.Inactive;

  title: string = 'Test';
  hunk: BlameHunk;
  directory: IntersectableDirectory;
  selectedObjectSubscription: Subscription;

  constructor(
    private visualizationQuery: VisualizationQuery
  ) {
  }

  ngOnInit() {
    this.selectedObjectSubscription = this.visualizationQuery.selectedObject$.subscribe(selectedObject => {
      if (selectedObject == null) {
        this.state = InformationPanelState.Inactive;
        return;
      }

      if (selectedObject instanceof BlameHunk) {
        this.hunk = selectedObject;
        this.state = InformationPanelState.Hunk;
      }

      if (selectedObject instanceof IntersectableDirectory) {
        this.directory = selectedObject;
        this.state = InformationPanelState.Directory;
      }
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.selectedObjectSubscription.unsubscribe();
  }
}
