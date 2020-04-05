import { Injectable } from '@angular/core';
import { VisualizationStore } from '../state/visualization.store';
import { BlameHunk } from '../model/blamehunk.model';
import { File } from '../model/file.model';
import { Directory } from '../model/directory.model';

@Injectable({
  providedIn: 'root'
})
export class VisualizationService {

  constructor(
    private visualizationStore: VisualizationStore
  ) { }

  // Sets selected object in the codecity.
  setSelectedObject(object: BlameHunk): void {
    this.visualizationStore.update(state =>  ({
      ...state,
      selectedObject: object
    }));
  }

  setFiles(files: File[]): void {
    this.visualizationStore.update(state =>  ({
      ...state,
      files: files
    }));
  }

  setProjectFiles(directory: Directory): void {
    this.visualizationStore.update(state => ({
      ...state,
      projectFiles: directory
    }));
  }
}