import { Component, OnInit } from '@angular/core';
import { Author } from '../../model/author.model';
import { Observable, of } from 'rxjs';
import { ProjectQuery } from 'src/app/store/project/project.query';

@Component({
  selector: 'cc-author-panel',
  template: `
  <div class="d-flex flex-column author-label-container p-3" ngDraggable>
    <h3 class="font-weight-bold mb-2">Authors</h3>
    <div class=" py-1 " *ngFor="let author of authors$ | async">
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
`,
  styleUrls: ['./author-panel.component.scss']
})
export class AuthorPanelComponent implements OnInit {

  authors$: Observable<Author[]>;

  constructor(
    private projectQuery: ProjectQuery
  ) {
    this.authors$ = this.projectQuery.authors$;
  }

  ngOnInit() {
  }

}
