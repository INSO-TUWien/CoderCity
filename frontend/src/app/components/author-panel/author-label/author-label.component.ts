import { Component, OnInit, Input } from '@angular/core';
import { Author } from 'src/app/model/author.model';
import { darkenColor } from 'src/app/util/color-scheme';

@Component({
  selector: 'cc-author-label',
  templateUrl: './author-label.component.html',
  styleUrls: ['./author-label.component.scss']
})
export class AuthorLabelComponent implements OnInit {

  @Input()
  name: string;

  @Input()
  size: string = 'normal';

  @Input()
  color: string = '#5BD3D6';

  get darkenedAuthorColor() {
    return darkenColor(this.color, 0.2);
  }

  constructor() { }

  ngOnInit() {
  }

}
