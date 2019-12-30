import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VisualizationComponent } from './visualization/visualization.component';
import { TimelineComponent } from './timeline/timeline.component';
import { GitgraphComponent } from './timeline/gitgraph/gitgraph.component';
import { BranchNameLabelComponent } from './timeline/gitgraph/branch-name-container/branch-name-label/branch-name-label.component';
import { BranchNameContainerComponent } from './timeline/gitgraph/branch-name-container/branch-name-container.component';
import { CommitMessageContainerComponent } from './timeline/gitgraph/commit-message-container/commit-message-container.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const SOCKET_HOST = 'http://localhost:3000';
const config: SocketIoConfig = { url: SOCKET_HOST, options: {}};
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
    FontAwesomeModule,
    HttpClientModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
