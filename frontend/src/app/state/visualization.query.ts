import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { VisualizationStore, VisualizationState } from './visualization.store';

@Injectable({ providedIn: 'root' })
export class VisualizationQuery extends Query<VisualizationState> {

  selectedObject$ = this.select(state => state.selectedObject);
  selectedCommit$ = this.select(state => state.selectedCommit);
  files$ = this.select(state => state.files);
  projectFiles$ = this.select(state => state.projectFiles);
  authorColorMap$ = this.select(state => state.authorColorMap);

  constructor(protected store: VisualizationStore) {
    super(store);
  }

}
