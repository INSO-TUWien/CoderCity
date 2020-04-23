import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisualizationComponent } from './components/visualization/visualization.component';


const routes: Routes = [
  { path: 'project/:id', component: VisualizationComponent},
  { path: '**', redirectTo: 'project/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
