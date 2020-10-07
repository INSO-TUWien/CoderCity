import { Component, OnInit } from '@angular/core';
import { VisualizationQuery } from 'src/app/store/visualization/visualization.query';
import { Observable } from 'rxjs';
import { darkenColor } from 'src/app/util/color-scheme';
import { faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';
import { VisualizationService } from 'src/app/store/visualization/visualization.service';
import { File } from '../../../model/file.model';
import { FileQuery } from 'src/app/store/files/file.query';
import { FileService } from 'src/app/store/files/file.service';
import { map, tap } from 'rxjs/operators';
import { isArray } from 'util';
import { FilterQuery, FilterService } from 'src/app/store/filter';

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

  constructor(
    private visualizationQuery: VisualizationQuery,
    private filterQuery: FilterQuery,
    private filterService: FilterService,
    private fileService: FileService,
    private visualizationService: VisualizationService,
  ) {
    this.selectedCommitTimeInterval$ = this.visualizationQuery.selectedCommitInterval$;
    this.selectedCommitTimeIntervalWithAuthorColor$ = this.visualizationQuery.selectedCommitTimeIntervalWithAuthorColor$;
    this.files$ = this.visualizationQuery.files$;
    // this.excludedFiles$ = this.fileQuery.selectActive().pipe(
    //   map(
    //     f => (!isArray(f)) ? [f] : f
    //   )
    // );
    this.excludedFiles$ = this.filterQuery.select(store => store.excludedFiles);
    // this.fileQuery.selectMany(['README.md', 'README.md']);
  }

  ngOnInit() {
  }

  onDeleteTimeInterval() {
    this.visualizationService.setSelectedCommitInterval({
      start: null,
      end: null
    });
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
