import { Component, OnInit } from '@angular/core';
import { Author } from '../../model/author.model';
import { getAuthorColor } from '../../util/color-scheme';
import { Observable, of } from 'rxjs';
import { ProjectQuery } from 'src/app/store/project/project.query';

@Component({
  selector: 'cc-author-panel',
  template: `
  <div class="d-flex flex-column">
    <div *ngFor="let author of authors$ | async">
        <div class="
        d-flex 
        flex-row 
        author-label-container 
        mt-2 
        justify-content-between  
        align-items-center">
        <div class="
            mr-2
            d-flex 
            justify-content-center         
            flex-column
        ">
            <div class="author-text text-left font-weight-bold">{{author.name}}</div>
            <div class="author-text text-left text-muted font-weight-light ">{{author.email}}</div>
        </div>
        <cc-author-label
          [name]="author.name"
          [email]="author.email"
          [color]="author.color"
        ></cc-author-label>
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
