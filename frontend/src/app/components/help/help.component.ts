import { Component, OnInit } from '@angular/core';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'cc-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  faHelp = faQuestion;

  constructor() { }

  ngOnInit() {
  }

  onClick() {
    alert('jsadfa');
  }

}
