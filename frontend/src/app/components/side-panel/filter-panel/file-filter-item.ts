import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface FilterableFile {
  enabled: boolean,
  name: string
}

@Component({
    selector: '[cc-file-panel-item]',
    template: `
    <div class="d-flex flex-row" (click)="onClick()">
      <div class="ml-2" >
        <input type="checkbox" class="form-check-input" [checked]="enabled">
      </div>
      <div class="file-item-name">{{file?.name}}</div>
    </div>`,
    styles: [`
      .file-item-name { word-wrap: break-word; word-break: break-all }
    `]
})
export class FilePanelItemComponent implements OnInit {

    private _file: FilterableFile;

    @Input('file')
    set file(value: FilterableFile) {
      this._file = value;
      this.enabled = value.enabled;
    }

    get file(): FilterableFile {
      return this._file;
    }
    
    enabled: boolean = true;

    @Output() 
    onFileSelectionChanged = new EventEmitter<boolean>();
  
    constructor() { }

    ngOnInit() { }

    onClick() {
      this.enabled = !this.enabled;
      this.onFileSelectionChanged.emit(this.enabled);
    }
}