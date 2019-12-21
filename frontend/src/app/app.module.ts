import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VisualizationComponent } from './visualization/visualization.component';
import { TimelineComponent } from './timeline/timeline.component';
import { GitgraphComponent } from './timeline/gitgraph/gitgraph.component';
import { BranchNameLabelComponent } from './timeline/gitgraph/branch-name-container/branch-name-label/branch-name-label.component';
import { BranchNameContainerComponent } from './timeline/gitgraph/branch-name-container/branch-name-container.component';

@NgModule({
  declarations: [
    AppComponent,
    VisualizationComponent,
    TimelineComponent,
    GitgraphComponent,
    BranchNameLabelComponent,
    BranchNameContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
