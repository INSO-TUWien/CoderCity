import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faSlidersH, faFilter } from '@fortawesome/free-solid-svg-icons';
import { faFolder } from '@fortawesome/free-regular-svg-icons';
import { NgbModal, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { SettingsPanelComponent } from '../settings-panel/settings-panel.component';
import { VisualizationService } from 'src/app/store/visualization/visualization.service';
import { forkJoin, Observable, of } from 'rxjs';
import { text } from '@fortawesome/fontawesome-svg-core';
import { combineAll, map, mergeMap, switchMap } from 'rxjs/operators';
import { ProjectQuery } from 'src/app/store/project/project.query';
import { FilterQuery } from 'src/app/store/filter';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { VisualizationQuery } from 'src/app/store/visualization/visualization.query';
import { File } from 'src/app/model/file.model';

@Component({
  selector: 'cc-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class MainPaneComponent implements OnInit {

  faSlidersH = faSlidersH;
  faFilter = faFilter;
  faFolder = faFolder;
  faTimesCircle = faTimesCircle;  

  hasItemSelected: boolean = false;
  searchTerm: string = '';
  files$: Observable<File[]>;

  @ViewChild('searchInput', {static: false} )
  searchInput: ElementRef;

  constructor(
    private modalService: NgbModal,
    private visualizationQuery: VisualizationQuery,
    private visualizationService: VisualizationService
  ) {
    this.files$ = this.visualizationQuery.files$;
  }

  ngOnInit() {
  }

  openModal() {
    this.modalService.open(SettingsPanelComponent);
  }

  openProject() {
    this.visualizationService.openProjectSelectionModal();
  }

  onDeleteSelectedItem() {
    this.resetSearchInput();
  }

  private resetSearchInput() {
    this.hasItemSelected = false;
    this.searchInput.nativeElement.value = "";
    //this.visualizationService.setSelectedSearchItem(null);
  }

  onOpenFilter() {
    this.visualizationService.setIsFilterViewActive(true);
  }

  search = (text$: Observable<string>) => text$.pipe(
    switchMap((term) => this.files$
    .pipe(
      map((files) => {
        const a = files
          .filter((f) => f.fullPath.toUpperCase().includes(term.toUpperCase()))
          .map(f => f.fullPath)
        return a;
      })
    ))
  )

  onSearchItemSelected(e: NgbTypeaheadSelectItemEvent) {
    const item = e?.item;
    this.visualizationService.setSelectedSearchItem(item);
    this.hasItemSelected = true;
  }

}
