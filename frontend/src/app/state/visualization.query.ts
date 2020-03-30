import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { VisualizationStore, VisualizationState } from './visualization.store';

@Injectable({ providedIn: 'root' })
export class VisualizationQuery extends Query<VisualizationState> {

  selectedObject$ = this.select(state => state.selectedObject);
  files$ = this.select(state => state.files);
  projectFiles$ = this.select(state => state.projectFiles);

  constructor(protected store: VisualizationStore) {
    super(store);
  }

}
