import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VisualizationComponent } from './visualization/visualization.component';
import { TimelineComponent } from './timeline/timeline.component';
import { GitgraphComponent } from './timeline/gitgraph/gitgraph.component';
import { BranchNameLabelComponent } from './timeline/gitgraph/branch-name-container/branch-name-label/branch-name-label.component';
import { BranchNameContainerComponent } from './timeline/gitgraph/branch-name-container/branch-name-container.component';
import { CommitMessageContainerComponent } from './timeline/gitgraph/commit-message-container/commit-message-container.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    VisualizationComponent,
    TimelineComponent,
    GitgraphComponent,
    BranchNameLabelComponent,
    BranchNameContainerComponent,
    CommitMessageContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
