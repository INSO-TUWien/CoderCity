import { Component, OnInit } from '@angular/core';
import { VisualizationQuery } from 'src/app/state/visualization.query';
import { Observable } from 'rxjs';
import { darkenColor } from 'src/app/util/color-scheme';
import { faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';
import { VisualizationService } from 'src/app/services/visualization.service';

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

  constructor(
    private visualizationQuery: VisualizationQuery,
    private visualizationService: VisualizationService
  ) {
    this.selectedCommitTimeInterval$ = this.visualizationQuery.selectedCommitInterval$;
    this.selectedCommitTimeIntervalWithAuthorColor$ = this.visualizationQuery.selectedCommitTimeIntervalWithAuthorColor$;
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
}
