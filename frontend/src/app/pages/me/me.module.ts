import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeComponent } from './me.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { EditStoryComponent } from "./edit-story/edit-story.component";
import { PendingChangesGuard } from "../../shared/utils/pending-changes.guard";
import { StoryPageComponent } from "./stories/story-page/story-page.component";
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { StorySettingsComponent } from "./stories/story-settings/story-settings.component";



const routes: Routes = [
  { path: '', component: MeComponent, pathMatch: 'full' },
  { path: 'settings', component: ProfileSettingsComponent },
  { path: 'stories', loadChildren: () => import('./stories/stories.module').then(m => m.StoriesModule) },
  { path: ':post_id', component: StoryPageComponent },
  { path: ':post_id/edit', component: EditStoryComponent, canDeactivate: [PendingChangesGuard] },
  { path: ':post_id/settings', component: StorySettingsComponent }, // TODO: Add pending changes guard
];

@NgModule({
  declarations: [],
  exports: [],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class MeModule { }
