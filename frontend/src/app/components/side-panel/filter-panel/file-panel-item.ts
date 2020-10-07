import { Component, Input, OnInit } from '@angular/core';
import { File } from '../../../model/file.model';

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

    @Input('file')
    file: File;

    @Input('enabled')
    enabled: boolean = true;

    constructor() { }

    ngOnInit() { }

    onClick() {
      this.enabled = !this.enabled;
    }
}