import { Component, OnInit } from '@angular/core';
import { Engine } from '../3d/engine';

@Component({
  selector: 'cc-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent implements OnInit {

  engine: Engine;
  constructor() { }

  ngOnInit() {
    this.engine = new Engine();
    this.engine.start();
  }


}
