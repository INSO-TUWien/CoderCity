import { Component, OnInit } from '@angular/core';
import { Visualization } from '../../3d/visualization';
import { EventBus } from 'src/app/3d/util/eventbus';
import * as EventEmitter from 'eventemitter3';
import { VisualizationService } from 'src/app/store/visualization/visualization.service';
import { VisualizationQuery } from 'src/app/store/visualization/visualization.query';
import { Directory } from 'src/app/model/directory.model';
import { BuildingAuthorColorMapper } from 'src/app/3d/util/color/building-author-color-mapper';
import { SettingsQuery } from '../settings-panel/state/settings.query';
import { Preferences, BuildingColorMapperPreference, DistrictColorMapperPreference } from '../settings-panel/state/preferences.model';
import { BuildingRandomColorMapper } from 'src/app/3d/util/color/building-random-color-mapper';
import { Author } from 'src/app/model/author.model';
import { ActivatedRoute } from '@angular/router';
import { ProjectQuery } from 'src/app/store/project/project.query';
import { Subscription, combineLatest, Observable, of } from 'rxjs';
import { DistrictDepthColorMapper } from 'src/app/3d/util/color/district-depth-color-mapper';
import { DistrictRandomColorMapper } from 'src/app/3d/util/color/district-random-color-mapper';
import { FilterQuery } from 'src/app/store/filter/filter.query';
import { Entity } from 'src/app/3d/entity';

@Component({
  selector: 'cc-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent implements OnInit {

  private visualization: Visualization;
  private eventBus: EventEmitter;
  private projectFiles: Directory;
  private authors: Author[];
  private filesSubscription: Subscription;
  private settingsSubscription: Subscription;
  private projectSubscription: Subscription;

  // Selected item
  selectedItemX: number;
  selectedItemY: number;
  selectedItemTitle: string;
  selectedItemEntity: Entity;
  selectedItemHidden: boolean = true;

  isLoading$: Observable<boolean>;

  constructor(
    private visualizationService: VisualizationService,
    private visualizationQuery: VisualizationQuery,
    private projectQuery: ProjectQuery, 
    private settingsQuery: SettingsQuery,
    private filterQuery: FilterQuery,
    private activatedRoute: ActivatedRoute,
  ) {
    this.isLoading$ = this.visualizationQuery.selectLoading();
  }

  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');

    // Open selection dialog if no project is selected
    if (id == null || id.length <= 0) {
      this.visualizationService.openProjectSelectionModal();
    }

    this.visualization = new Visualization();
    this.initEventBus();

    this.projectSubscription = this.projectQuery.selectActive().subscribe(project => {
      if (project == null) {
        this.visualizationService.openProjectSelectionModal();
      }
    });

    this.visualizationQuery.selectedCommit$.subscribe(
      (commit) => {
        // A new commit has been selected using the commit graph.
        // Reset visualization.
        if (commit === null) {
          this.visualization.deleteCity();
        }
      }
    );

    this.visualizationQuery.projectFiles$.subscribe(
      (val) => {
        const directory = val;
        if (directory != null) {
          this.projectFiles = directory;
          this.removeSelectedItem();
          this.renderCity();
        }
      }
    );

    /**
     * Add Selected Item modal when an item has been selected via search.
     */
    this.visualizationQuery.selectedSearchItem$.subscribe((searchItem) => {
      if (searchItem === null) {
        this.removeSelectedItem();
      } else if (searchItem.length > 0) {
        // Remove prior selected item
        if (this.selectedItemEntity != null) {
          this.selectedItemEntity.removeScreenSpaceCoordinatesListener();
          
        }
        // Add selected item marker
        this.selectedItemEntity = this.visualization.searchEntityByPath(searchItem)
        this.selectedItemTitle = this.selectedItemEntity?.userData?.fullPath;
        
        if (this.selectedItemEntity != null) {
          let camera = this.visualization.camera;
          this.selectedItemEntity.addScreenSpaceCoordinatesListener(camera, (coords) => {
            this.selectedItemX = coords.x;
            this.selectedItemY = coords.y;
          })
          this.selectedItemHidden = false;
        }
        // alert(JSON.stringify(resultEntity))
      }
    });

    // Handle preference changes. Wait for author data before rendering.
    combineLatest(
      this.projectQuery.authors$, 
      this.settingsQuery.preferences$, 
      this.filterQuery.excludedFiles$,
      this.filterQuery.excludedAuthors$
    ).subscribe(
      ([authors, preferences, excludedFiles, excludedAuthors]) => {
        this.authors = authors;
        if (authors != null && preferences != null) {
            this.handleVisualizationOptions(preferences, excludedFiles, excludedAuthors);
            this.renderCity();
        }
      }
    );
  }

  private renderCity(): void {
    if (this.projectFiles != null) {
      this.visualization.generateCity(this.projectFiles);
    }
  }

  private handleVisualizationOptions(preferences: Preferences, excludedFiles: string[], excludedAuthors: string[]) {
    if (preferences == null) {
        console.error(`Visualization: setPreferences: preferences is null or undefined.`);
    }
    // Update BuildingColorMapper based on set preference
    const buildingColorPreference = preferences.colorMapping.buildingColor;
    if (buildingColorPreference === BuildingColorMapperPreference.author) {
        this.visualization.setBuildingColorMapper(new BuildingAuthorColorMapper(this.authors));
    } else if (buildingColorPreference === BuildingColorMapperPreference.random) {
        this.visualization.setBuildingColorMapper(new BuildingRandomColorMapper());
    }

    // Handle district color mapper
    const districtColorPreference = preferences.colorMapping.districtColor;
    if (districtColorPreference === DistrictColorMapperPreference.depth) {
      this.visualization.setDistrictColorMapper(new DistrictDepthColorMapper());
    } else if (districtColorPreference === DistrictColorMapperPreference.random) {
      this.visualization.setDistrictColorMapper(new DistrictRandomColorMapper());
    }

    if (excludedFiles !== null) {
      this.visualization.setExcludedFiles(excludedFiles);
    }

    if (excludedAuthors !== null) {
      this.visualization.setExcludedAuthors(excludedAuthors);
    }
  }

  ngOnDestroy(): void {
    this.filesSubscription.unsubscribe();
    this.settingsSubscription.unsubscribe();
    this.projectSubscription.unsubscribe();
  }

  onCloseSelectedItemModal(): void {
    this.removeSelectedItem();
  }

  private removeSelectedItem(): void {
    this.visualizationService.setSelectedSearchItem(null);
    this.selectedItemHidden = true;
    this.selectedItemEntity?.removeScreenSpaceCoordinatesListener();
  }

  private initEventBus(): void {
    this.eventBus = EventBus.instance;
    this.eventBus.on('intersectObject', (intersectedObject) => {
      this.visualizationService.setSelectedObject(intersectedObject);
    });
  }
}
