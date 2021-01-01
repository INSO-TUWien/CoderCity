import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'cc-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss']
})
export class HelpModalComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }

}
