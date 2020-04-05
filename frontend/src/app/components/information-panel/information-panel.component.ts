import { Component, OnInit } from '@angular/core';
import { BlameHunk } from 'src/app/model/blamehunk.model';
import { Observable, Subscription } from 'rxjs';
import { VisualizationQuery } from 'src/app/state/visualization.query';

@Component({
  selector: 'cc-information-panel',
  templateUrl: './information-panel.component.html',
  styleUrls: ['./information-panel.component.scss']
})
export class InformationPanelComponent implements OnInit {
  active: boolean = true;
  title: string = 'Test';
  hunk$: Observable<BlameHunk>;
  selectedObjectSubscription: Subscription;

  constructor(
    private visualizationQuery: VisualizationQuery
  ) {
  }

  ngOnInit() {
    this.hunk$ = this.visualizationQuery.selectedObject$;
    this.selectedObjectSubscription = this.hunk$.subscribe((hunk) => {
      if (hunk != null) {
        this.active = true;
      } else {
        this.active = false;
      }
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.selectedObjectSubscription.unsubscribe();
  }
}
