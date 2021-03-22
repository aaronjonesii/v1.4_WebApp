import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeComponent } from './me.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { EditStoryComponent } from "./edit-story/edit-story.component";



const routes: Routes = [
  { path: '', component: MeComponent, pathMatch: 'full' },
  { path: ':post_id/edit', component: EditStoryComponent },
  { path: 'stories', loadChildren: () => import('./stories/stories.module').then(m => m.StoriesModule) },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class MeModule { }
