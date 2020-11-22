import { Component, OnInit } from '@angular/core';
import { BlameHunk } from 'src/app/model/blamehunk.model';
import { Subscription } from 'rxjs';
import { VisualizationQuery } from 'src/app/store/visualization/visualization.query';
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
  hunk: BlameHunk;
  directory: IntersectableDirectory;
  selectedObjectSubscription: Subscription;

  private _x: number;
  get x(): number {
    return this._x;
  }
  set x(value: number) {
    if (value > 0)
      this._x = value;
  }

  private _y: number;
  get y(): number {
    return this._y;
  }
  set y(value: number) {
    if (value > 0)
      this._y = value;
  }

  onMouseMove = e => {
    this.x = e.offsetX;
    this.y = e.offsetY;
  }

  constructor(
    private visualizationQuery: VisualizationQuery
  ) {
  }

  ngOnInit() {
    window.addEventListener('mousemove', this.onMouseMove);
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
    window.removeEventListener('mousemove', this.onMouseMove);
    this.selectedObjectSubscription.unsubscribe();
  }
}
