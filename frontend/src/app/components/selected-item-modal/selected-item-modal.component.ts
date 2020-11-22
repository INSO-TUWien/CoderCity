import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cc-selected-item-modal',
  templateUrl: './selected-item-modal.component.html',
  styleUrls: ['./selected-item-modal.component.scss']
})
export class SelectedItemModalComponent implements OnInit {

  @Input('hidden')
  hidden = false;

  @Input('x')
  x: number;

  @Input('y')
  y: number;

  @Input('title')
  title: string = 'Title';

  constructor() { }

  ngOnInit() {
  }

}
