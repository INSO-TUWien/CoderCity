import { Component, OnInit } from '@angular/core';
import { VisualizationQuery } from 'src/app/store/visualization/visualization.query';
import { combineLatest, Observable } from 'rxjs';
import { darkenColor } from 'src/app/util/color-scheme';
import { faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';
import { VisualizationService } from 'src/app/store/visualization/visualization.service';
import { File } from '../../../model/file.model';
import { map, tap } from 'rxjs/operators';
import { isArray } from 'util';
import { FilterQuery, FilterService } from 'src/app/store/filter';
import { FilterableFile } from './file-panel-item';

@Component({
  selector: 'cc-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent implements OnInit {

  faChevronUp = faChevronUp;
  faTimes = faTimes;

  isViewActive$ = this.visualizationQuery.isFilterPanelActive$;

  selectedCommitTimeInterval$;
  selectedCommitTimeIntervalWithAuthorColor$: Observable<any>;
  files$: Observable<File[]>;
  excludedFiles$: Observable<string[]>;
  filteredFiles$: Observable<FilterableFile[]>;

  constructor(
    private visualizationQuery: VisualizationQuery,
    private filterQuery: FilterQuery,
    private filterService: FilterService,
    private visualizationService: VisualizationService,
  ) {
    this.selectedCommitTimeInterval$ = this.visualizationQuery.selectedCommitInterval$;
    this.selectedCommitTimeIntervalWithAuthorColor$ = this.visualizationQuery.selectedCommitTimeIntervalWithAuthorColor$;
    this.files$ = this.visualizationQuery.files$;
    this.excludedFiles$ = this.filterQuery.select(store => store.excludedFiles);
    this.filteredFiles$ = combineLatest(this.visualizationQuery.files$, this.excludedFiles$)
      .pipe(
        map(([files, excludedFiles]) => 
          (
            files.map((file) => ({
              name: file.name + '',
              // If file is not in excluded files ,then set enabled status to true.
              enabled: (excludedFiles.findIndex(e => e == file.name) == -1) ? true : false
            }))
          )
        )
      );
  }



  ngOnInit() {
  }

  onDeleteTimeInterval() {
    this.visualizationService.setSelectedCommitInterval({
      start: null,
      end: null
    });
  }

  onResetExcludedFiles() {
    this.filterService.reset();
  }

  onClose() {
    this.visualizationService.setIsFilterViewActive(false);
  }

  darkenColor(color: string): string {
    if (color !== null) {
      return darkenColor(color, 0.6);
    } else {
      return '';
    }
  }

  onFileSelectionChanged(enabled: boolean, file: File) {
    if (enabled) {
      this.filterService.includeFile(`${file.name}`);
    } else {
      this.filterService.excludeFile(`${file.name}`);
    }
  }
}
