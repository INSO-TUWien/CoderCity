import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VisualizationComponent } from './components/visualization/visualization.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { GitgraphComponent } from './components/timeline/gitgraph/gitgraph.component';
import { BranchNameLabelComponent } from './components/timeline/gitgraph/branch-name-container/branch-name-label/branch-name-label.component';
import { BranchNameContainerComponent } from './components/timeline/gitgraph/branch-name-container/branch-name-container.component';
import { CommitMessageContainerComponent } from './components/timeline/gitgraph/commit-message-container/commit-message-container.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { BranchSimpleNamePipe } from './pipes/branch-simple-name.pipe';
import { SelectionPopoverComponent } from './components/selection-popover/selection-popover.component';
import { AuthorPanelComponent } from './components/author-panel/author-panel.component';
import { AuthorInitialsPipe } from './pipes/author-initials.pipe';
import { InformationPanelComponent } from './components/information-panel/information-panel.component';
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import { SettingsPanelComponent } from './components/settings-panel/settings-panel.component';
import { PlayButtonComponent } from './components/timeline/play-button/play-button.component';
import { TimeIntervalLabelComponent } from './components/timeline/time-interval-label/time-interval-label.component';

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
    CommitMessageContainerComponent,
    BranchSimpleNamePipe,
    SelectionPopoverComponent,
    AuthorPanelComponent,
    AuthorInitialsPipe,
    InformationPanelComponent,
    SidePanelComponent,
    SettingsPanelComponent,
    PlayButtonComponent,
    TimeIntervalLabelComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
