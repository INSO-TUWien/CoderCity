import { Component, OnInit } from '@angular/core';
import { Engine } from '../../3d/engine';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { EventBus } from 'src/app/3d/util/eventbus';
import * as EventEmitter from 'eventemitter3';
import { BlameHunk } from 'src/app/model/blamehunk.model';
import { VisualizationService } from 'src/app/services/visualization.service';
import { VisualizationQuery } from 'src/app/state/visualization.query';
import { File } from 'src/app/model/file.model';
import { Directory } from 'src/app/model/directory.model';
import { Object3D } from 'three';
import { BuildingSegment } from 'src/app/3d/entities/BuildingSegment';
import { GitQuery } from 'src/app/state/git.query';
import { BuildingAuthorColorMapper } from 'src/app/3d/util/color/building-author-color-mapper';

@Component({
  selector: 'cc-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent implements OnInit {

  engine: Engine;
  private eventBus: EventEmitter;
  private projectFiles: Directory;
  private filesSubscription: Subscription;

  constructor(
    private visualizationService: VisualizationService,
    private visualizationQuery: VisualizationQuery,
    private gitQuery: GitQuery
  ) {
  }

  ngOnInit() {
    this.engine = new Engine();
    this.engine.start();
    this.initEventBus();

    // Render code city if both authors and projectFiles fields are existing
    combineLatest(this.gitQuery.authors$, this.visualizationQuery.projectFiles$).subscribe(
      (val) => {
        const authors  = val[0];
        const directory = val[1];
        if (authors != null && directory != null) {
          this.projectFiles = directory;
          const authorBuildingColorMapper = new BuildingAuthorColorMapper(authors);
          this.engine.setBuildingColorMapper(authorBuildingColorMapper);
          this.engine.generateCity(this.projectFiles);
        }
      }
    );
  }

  ngOnDestroy(): void {
    //Called once, before the instance istroyed.
    //Add 'implements OnDestroy' to the class.
    this.filesSubscription.unsubscribe();
  }

  private initEventBus(): void {
    this.eventBus = EventBus.instance;
    this.eventBus.on('intersectObject', (intersectedObject) => {
      this.visualizationService.setSelectedObject(intersectedObject);
      // if (intersectedObject != null) { 
      //   if (intersectedObject instanceof BlameHunk) {
      //     this.visualizationService.setSelectedObject(intersectedObject);
      //   }
      // }
    });
  }
}
