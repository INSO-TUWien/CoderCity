import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/store/project/project.service';
import { Project } from 'src/app/store/project/project.model';
import { ProjectStore } from 'src/app/store/project/project.store';
import { VisualizationStore } from 'src/app/store/visualization/visualization.store';

@Component({
  selector: 'cc-project-chooser',
  templateUrl: './project-chooser.component.html',
  styleUrls: ['./project-chooser.component.scss']
})
export class ProjectChooserComponent implements OnInit {

  projects$ = this.projectService.get();

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private projectService: ProjectService,
    private projectStore: ProjectStore,
    private visualizationStore: VisualizationStore,
  ) {
  }

  ngOnInit() {
  }

  onSelectedItem(project: Project) {
    this.projectStore.reset();
    this.visualizationStore.reset();
    this.projectService.setActive(project.id);
    this.router.navigate(['/project', project.id]);
    this.activeModal.close();
  }
}
