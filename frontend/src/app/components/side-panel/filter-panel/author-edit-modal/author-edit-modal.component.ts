import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Author } from 'src/app/model/author.model';
import { FilterService } from 'src/app/store/filter';
import { ProjectService } from 'src/app/store/project/project.service';
import { COLORS } from 'src/app/util/color-scheme';

@Component({
  selector: 'cc-author-edit-modal',
  templateUrl: './author-edit-modal.component.html',
  styleUrls: ['./author-edit-modal.component.scss']
})
export class AuthorEditModalComponent implements OnInit {

  private colors: string[] = COLORS;

  private _author: Author;
  
  set author(value) {
    this.activeColor = value.color;
    this._author = value;
  }
  get author() {
    return this._author;
  }

  enabled: boolean = true;

  activeColor: string = '';

  constructor(
    public activeModal: NgbActiveModal,
    private filterService: FilterService,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
  }

  onColorClicked(color: string) {
    this.activeColor = color;
  }

  onCheckboxChanged() {
    this.enabled = !this.enabled;
  }

  onSave() {
    if (this.enabled) {
      this.filterService.includeAuthor(this.author);
      this.projectService.updateAuthorColor(this.author, this.activeColor);
    } else {
      this.filterService.excludeAuthor(this.author);
      this.projectService.updateAuthorColor(this.author, this.activeColor);
    }
    this.activeModal.close();
  }
}
