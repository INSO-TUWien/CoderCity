import { Component, OnInit } from '@angular/core';
import { Author } from '../../model/author.model';
import { getAuthorColor } from '../../util/color-scheme';
import { Observable, of } from 'rxjs';
import { ProjectQuery } from 'src/app/store/project/project.query';

@Component({
  selector: 'cc-author-panel',
  templateUrl: './author-panel.component.html',
  styleUrls: ['./author-panel.component.scss']
})
export class AuthorPanelComponent implements OnInit {

  authors$: Observable<Author[]>;

  constructor(
    private projectQuery: ProjectQuery
  ) {
    this.authors$ = this.projectQuery.authors$;
    //this.initSampleAuthors();
  }

  private initSampleAuthors() {
    const authors: Author[] = [];
    for (let i = 0; i < 5; i++) {
      authors.push({
        name: `Author ${i}`,
        email: ``,
        color: getAuthorColor(i)
      });
    }
    this.authors$ = of(authors);
  }

  ngOnInit() {
  }

}
