import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Author } from 'src/app/model/author.model';
import { COLORS } from 'src/app/util/color-scheme';

@Component({
  selector: 'cc-author-edit-modal',
  templateUrl: './author-edit-modal.component.html',
  styleUrls: ['./author-edit-modal.component.scss']
})
export class AuthorEditModalComponent implements OnInit {

  private _author: Author;
  set author(value) {
    this.activeColor = value.color;
    this._author = value;
  }
  get author() {
    return this._author;
  }

  colors: string[] = COLORS;
  activeColor: string = '';

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }

  onColorClicked(color: string) {
    this.activeColor = color;
  }

}
