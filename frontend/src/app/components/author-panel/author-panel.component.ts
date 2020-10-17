import { Component, OnInit } from '@angular/core';
import { Author } from '../../model/author.model';
import { Observable } from 'rxjs';
import { ProjectQuery } from 'src/app/store/project/project.query';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'cc-author-panel',
  template: `
  <div class="d-flex flex-column author-label-container p-3" ngDraggable>
    <div class="d-flex flex-row justify-content-between">
      <h3 class="font-weight-bold mb-2">Authors</h3>
      <button class="btn btn-sm btn-light" (click)="onToggleActive()">
        <fa-icon *ngIf="active" [icon]="faChevronUp" size="sm"></fa-icon>
        <fa-icon *ngIf="!active" [icon]="faChevronDown" size="sm"></fa-icon>
      </button>
    </div>
    <div *ngIf="active" >
      <div  class="py-1 overflow-auto" *ngFor="let author of authors$ | async">
        <div class="
            d-flex
            flex-row
            p-0
          ">      
            <cc-author-label [name]="author.name" [color]="author.color" ></cc-author-label>
            <div class="
              ml-2
              d-flex 
              justify-content-center         
              flex-column
            ">
              <div class="small text-left font-weight-bold item-overflow-wrap ">{{author.name}}</div>
              <div class="small text-left text-muted font-weight-light item-overflow-wrap ">{{author.email}}</div>
            </div>
        </div>
      </div>
    </div>
</div>
`,
  styleUrls: ['./author-panel.component.scss']
})
export class AuthorPanelComponent implements OnInit {

  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;
  
  // When active the panel is maximized.
  active: boolean = true;
  authors$: Observable<Author[]>;

  constructor(
    private projectQuery: ProjectQuery
  ) {
    this.authors$ = this.projectQuery.authors$;
  }

  ngOnInit() {
  }

  onToggleActive() {
    this.active = !this.active;
  }

}
