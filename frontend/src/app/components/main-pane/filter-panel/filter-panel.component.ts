import { Component, OnInit } from '@angular/core';
import { VisualizationQuery } from 'src/app/store/visualization/visualization.query';
import { combineLatest, Observable } from 'rxjs';
import { darkenColor } from 'src/app/util/color-scheme';
import { faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';
import { VisualizationService } from 'src/app/store/visualization/visualization.service';
import { File } from '../../../model/file.model';
import { map, tap } from 'rxjs/operators';
import { FilterQuery, FilterService } from 'src/app/store/filter';
import { FilterableFile } from './file-filter-item';
import { ProjectQuery } from 'src/app/store/project/project.query';
import { Author } from 'src/app/model/author.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthorEditModalComponent } from './author-edit-modal/author-edit-modal.component';
import { FilterableAuthor } from './author-filter-item';

@Component({
  selector: 'cc-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent implements OnInit {

  faChevronUp = faChevronUp;
  faTimes = faTimes;

  isViewActive$ = this.visualizationQuery.isFilterPanelActive$;


  public color1: string = '#2889e9';

  selectedCommitTimeInterval$;
  selectedCommitTimeIntervalWithAuthorColor$: Observable<any>;
  excludedFiles$: Observable<string[]>;
  filteredFiles$: Observable<FilterableFile[]>;
  filteredAuthors$: Observable<FilterableAuthor[]>;
  authors$: Observable<Author[]>;

  constructor(
    private visualizationQuery: VisualizationQuery,
    private filterQuery: FilterQuery,
    private filterService: FilterService,
    private visualizationService: VisualizationService,
    private projectQuery: ProjectQuery,
    private modalService: NgbModal,
  ) {
    this.selectedCommitTimeInterval$ = this.visualizationQuery.selectedCommitInterval$;
    this.selectedCommitTimeIntervalWithAuthorColor$ = this.visualizationQuery.selectedCommitTimeIntervalWithAuthorColor$;
    this.excludedFiles$ = this.filterQuery.select(store => store.excludedFiles);
    this.filteredFiles$ = combineLatest(
      this.visualizationQuery.files$, 
      this.excludedFiles$, 
      this.filterQuery.fileSearchTerm$
    )
      .pipe(
        map(([files, excludedFiles, searchterm]) =>
          (
            files
              .filter((f) => f.fullPath.toUpperCase().includes(searchterm.toUpperCase())) // Filter list by searchterm independent on upper/lower casing
              .map((file) => ({
                name: file.name + '',
                // If file is not in excluded files ,then set enabled status to true.
                enabled: (excludedFiles.findIndex(e => e == file.name) == -1) ? true : false
            }))
          )
        )
      );
    
    this.filteredAuthors$ = combineLatest(this.projectQuery.authors$, this.filterQuery.excludedAuthors$)
      .pipe(
        map(([authors, excludedAuthors]) =>
          (
            authors.map((author) => ({
              author: author,
              // If file is not in exlusion list ,then set enabled status to true.
              enabled: (excludedAuthors.findIndex(e => e == Author.hashCode(author)) == -1) ? true : false
            }))
          )
        ));
    this.authors$ = this.projectQuery.authors$;
  }

  ngOnInit() {
  }

  fileSearchInputChanged(e) {
    this.filterService.setFileSearchString(e?.target?.value);
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

  // Author filter item checkbox clicked.
  onAuthorItemSelectionChanged(enabled: boolean, filterableAuthor: FilterableAuthor) {
    if (enabled) {
      this.filterService.includeAuthor(filterableAuthor.author);
    } else {
      this.filterService.excludeAuthor(filterableAuthor.author);
    }
  }

  onAuthorFilterItemClick(event, filterableAuthor: FilterableAuthor) {
    const modalRef = this.modalService.open(AuthorEditModalComponent);
    modalRef.componentInstance.author = filterableAuthor.author;
    modalRef.componentInstance.enabled = filterableAuthor.enabled;
  }
}
