import { Component, OnInit } from '@angular/core';
import { Author } from '../model/author.model';
import { getAuthorColor } from '../util/color-scheme';

@Component({
  selector: 'cc-author-panel',
  templateUrl: './author-panel.component.html',
  styleUrls: ['./author-panel.component.scss']
})
export class AuthorPanelComponent implements OnInit {

  authors: Author[] = [];

  constructor() {
    this.initSampleAuthors();
  }

  private initSampleAuthors() {
    for (let i = 0; i < 5; i++) {
      this.authors.push({
        fullname: `Author ${i}`,
        color: getAuthorColor(i)
      });
    }
  }

  ngOnInit() {
  }

}
