import { Component, OnInit } from '@angular/core';
import { Engine } from '../../3d/engine';
import { EventBus } from 'src/app/3d/util/eventbus';
import * as EventEmitter from 'eventemitter3';
import { VisualizationService } from 'src/app/services/visualization.service';
import { VisualizationQuery } from 'src/app/state/visualization.query';
import { Directory } from 'src/app/model/directory.model';
import { BuildingAuthorColorMapper } from 'src/app/3d/util/color/building-author-color-mapper';
import { SettingsQuery } from '../settings-panel/state/settings.query';
import { Preferences, BuildingColorMapperPreference, DistrictColorMapperPreference } from '../settings-panel/state/preferences.model';
import { BuildingRandomColorMapper } from 'src/app/3d/util/color/building-random-color-mapper';
import { Author } from 'src/app/model/author.model';
import { ActivatedRoute } from '@angular/router';
import { ProjectQuery } from 'src/app/store/project/project.query';
import { Subscription, combineLatest } from 'rxjs';
import { DistrictDepthColorMapper } from 'src/app/3d/util/color/district-depth-color-mapper';
import { DistrictRandomColorMapper } from 'src/app/3d/util/color/district-random-color-mapper';

@Component({
  selector: 'cc-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent implements OnInit {

  engine: Engine;
  private eventBus: EventEmitter;
  private projectFiles: Directory;
  private authors: Author[];
  private filesSubscription: Subscription;
  private settingsSubscription: Subscription;
  private projectSubscription: Subscription;

  constructor(
    private visualizationService: VisualizationService,
    private visualizationQuery: VisualizationQuery,
    private projectQuery: ProjectQuery, 
    private settingsQuery: SettingsQuery,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    if (id == null || id.length <= 0) {
      this.visualizationService.openProject();
    }

    this.engine = new Engine();
    this.engine.start();
    this.initEventBus();

    this.projectSubscription = this.projectQuery.selectActive().subscribe(project => {
      if (project != null) {
      } else {
        this.visualizationService.openProject();
      }
    });

    this.visualizationQuery.selectedCommit$.subscribe(
      (commit) => {
        if (commit === null) {
          this.engine.deleteCity();
        }
      }
    );

    this.visualizationQuery.projectFiles$.subscribe(
      (val) => {
        const directory = val;
        if (directory != null) {
          this.projectFiles = directory;
          this.renderCity();
        }
      }
    );

    // Handle preference changes. Wait for author data before rendering.
    combineLatest(this.projectQuery.authors$, this.settingsQuery.preferences$).subscribe(
      ([authors, preferences]) => {
        this.authors = authors;
        if (authors != null && preferences != null) {
            this.handlePreferences(preferences);
            this.renderCity();
        }
      }
    );
  }

  private renderCity(): void {
    if (this.projectFiles != null) {
      this.engine.generateCity(this.projectFiles);
    }
  }

  private handlePreferences(preferences: Preferences) {
    if (preferences == null) {
        console.error(`Engine: setPreferences: preferences is null or undefined.`);
    }
    // Update BuildingColorMapper based on set preference
    const buildingColorPreference = preferences.colorMapping.buildingColor;
    if (buildingColorPreference === BuildingColorMapperPreference.author) {
        this.engine.setBuildingColorMapper(new BuildingAuthorColorMapper(this.authors));
    } else if (buildingColorPreference === BuildingColorMapperPreference.random) {
        this.engine.setBuildingColorMapper(new BuildingRandomColorMapper());
    }

    // Handle district color mapper
    const districtColorPreference = preferences.colorMapping.districtColor;
    if (districtColorPreference === DistrictColorMapperPreference.depth) {
      this.engine.setDistrictColorMapper(new DistrictDepthColorMapper());
    } else if (districtColorPreference === DistrictColorMapperPreference.random) {
      this.engine.setDistrictColorMapper(new DistrictRandomColorMapper());
    }
  }

  ngOnDestroy(): void {
    this.filesSubscription.unsubscribe();
    this.settingsSubscription.unsubscribe();
    this.projectSubscription.unsubscribe();
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
