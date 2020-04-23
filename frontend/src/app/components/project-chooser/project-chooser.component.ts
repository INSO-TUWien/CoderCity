import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectQuery } from './state/project.query';
import { ProjectService } from './state/project.service';
import { Router } from '@angular/router';
import { Project } from './state/project.model';

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
    private projectService: ProjectService
  ) {
  }

  ngOnInit() {
  }

  onSelectedItem(project: Project) {
    this.router.navigate(['/project', project.id]);
    this.activeModal.close();
  }
}
