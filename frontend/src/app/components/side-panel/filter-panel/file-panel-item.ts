import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: '[cc-file-panel-item]',
    template: `
    <div class="d-flex flex-row">
      <div  class="ml-2" >
        <input type="checkbox" class="form-check-input">
      </div>
      <div>{{file}}</div>
    </div>`
})
export class FilePanelItemComponent implements OnInit {

    @Input('file')
    file: string = '';

    constructor() { }

    ngOnInit() { }
}