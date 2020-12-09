import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Author } from 'src/app/model/author.model';

export interface FilterableAuthor {
  enabled: boolean,
  author: Author
}

@Component({
  selector: '[cc-author-filter-item]',
  template: `
    <div class="
      d-flex
      flex-row
    "
    (click)="onAuthorItemClicked()"
    >
    <span class="ml-2">
      <input 
        type="checkbox" 
        class="form-check-input" 
        [checked]="enabled"
        (click)="onCheckboxChanged($event)"
      >
    </span>
    
    <cc-author-label [name]="author.name" [color]="author.color" size="xs"></cc-author-label>
    <div class="
      ml-2
      d-flex 
      justify-content-center         
      flex-column
    ">
      <div class="small text-left font-weight-bold">{{author.name}}</div>
      <div class="small text-left text-muted font-weight-light ">{{author.email}}</div>
    </div>
  </div>
    
    `,
  styles: [`
      .item-name { word-wrap: break-word; word-break: break-all }
    `]
})
export class AuthorFilterItemComponent implements OnInit {

  @Input('author')
  author: Author;

  @Input('enabled')
  enabled: boolean = true;

  @Output()
  onAuthorItemSelectionChanged = new EventEmitter<boolean>();

  @Output()
  onItemClicked = new EventEmitter<void>();

  constructor(
  ) {
  }

  ngOnInit() { }

  onCheckboxChanged(event) {
    this.enabled = !this.enabled;
    this.onAuthorItemSelectionChanged.emit(this.enabled);
    event.stopPropagation();
  }

  onAuthorItemClicked() {
    this.onItemClicked.emit();
  }

}