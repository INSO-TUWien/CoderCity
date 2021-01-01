import { Component, OnInit } from '@angular/core';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelpModalComponent } from './help-modal/help-modal.component';

@Component({
  selector: 'cc-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  faHelp = faQuestion;

  constructor(
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
  }

  onClick() {
    this.modalService.open(HelpModalComponent);
  }

}
