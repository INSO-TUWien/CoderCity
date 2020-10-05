import { Component, Input, OnInit } from '@angular/core';
import { File } from '../../../model/file.model';

@Component({
    selector: '[cc-file-panel-item]',
    template: `
    <div class="d-flex flex-row">
      <div  class="ml-2" >
        <input type="checkbox" class="form-check-input">
      </div>
      <div>{{file?.name}}</div>
    </div>`
})
export class FilePanelItemComponent implements OnInit {

    @Input('file')
    file: File;

    constructor() { }

    ngOnInit() { }
}