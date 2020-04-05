import { Component, OnInit } from '@angular/core';
import { Author } from '../../model/author.model';
import { getAuthorColor } from '../../util/color-scheme';
import { GitQuery } from 'src/app/state/git.query';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'cc-author-panel',
  templateUrl: './author-panel.component.html',
  styleUrls: ['./author-panel.component.scss']
})
export class AuthorPanelComponent implements OnInit {

  authors$: Observable<Author[]>;

  constructor(
    private gitQuery: GitQuery
  ) {
    this.authors$ = this.gitQuery.authors$;
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
