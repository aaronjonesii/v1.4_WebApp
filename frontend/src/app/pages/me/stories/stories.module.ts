import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { StoriesComponent } from "./stories.component";
import { DraftsComponent } from "./tabs/drafts/drafts.component";
import { SharedModule } from "../../../shared/shared.module";
import { UnlistedComponent } from "./tabs/unlisted/unlisted.component";
import { PublishedComponent } from "./tabs/published/published.component";
import { StatusStoryComponent } from './status-stories-list/status-story/status-story.component';

const routes: Routes = [
  { path: '', component: StoriesComponent, children: [
      { path: '', redirectTo: 'drafts', pathMatch: 'full' },
      { path: 'drafts', component: DraftsComponent },
      { path: 'published', component: PublishedComponent },
      { path: 'unlisted', component: UnlistedComponent },
    ] },
];

@NgModule({
  declarations: [StatusStoryComponent],
  exports: [
    StatusStoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class StoriesModule { }
