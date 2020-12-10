import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faSlidersH, faFilter } from '@fortawesome/free-solid-svg-icons';
import { faFolder } from '@fortawesome/free-regular-svg-icons';
import { NgbModal, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { SettingsPanelComponent } from '../settings-panel/settings-panel.component';
import { VisualizationService } from 'src/app/store/visualization/visualization.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { VisualizationQuery } from 'src/app/store/visualization/visualization.query';
import { File } from 'src/app/model/file.model';

@Component({
  selector: 'cc-main-pane',
  templateUrl: './main-pane.component.html',
  styleUrls: ['./main-pane.component.scss']
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
    private visualizationService: VisualizationService,
  ) {
    this.files$ = this.visualizationQuery.files$;
    this.visualizationQuery.selectedSearchItem$.subscribe((selectedItem) => {
      if (selectedItem == null) {
        // Reset search bar
        this.resetSearchInput();
      }
    });
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
    this.visualizationService.setSelectedSearchItem(null);
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
