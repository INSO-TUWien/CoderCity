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
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { GitEffects } from './shared/git/git.effects';
import { EffectsModule } from '@ngrx/effects';
import { BranchSimpleNamePipe } from './pipes/branch-simple-name.pipe';

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
    BranchSimpleNamePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    EffectsModule.forRoot([GitEffects]),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
