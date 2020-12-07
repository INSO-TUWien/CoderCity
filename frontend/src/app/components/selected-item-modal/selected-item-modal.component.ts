import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'cc-selected-item-modal',
  templateUrl: './selected-item-modal.component.html',
  styleUrls: ['./selected-item-modal.component.scss']
})
export class SelectedItemModalComponent implements OnInit {

  faTimesCircle = faTimesCircle;

  @Input('hidden')
  hidden = false;

  @Input('x')
  x: number;

  @Input('y')
  y: number;

  @Input('title')
  title: string = 'Title';

  @Output() 
  onClose = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  close() {
    this.onClose.emit();
  }

}
