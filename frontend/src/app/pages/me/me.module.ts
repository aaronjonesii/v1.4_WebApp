import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeComponent } from './me.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { EditStoryComponent } from "./edit-story/edit-story.component";
import { PendingChangesGuard } from "../../shared/utils/pending-changes.guard";
import { StoryPageComponent } from "./stories/story-page/story-page.component";
import { SettingsComponent } from './settings/settings.component';
import { SettingsSectionComponent } from './settings/settings-section/settings-section.component';
import { SettingsSectionItemComponent } from './settings/settings-section/settings-section-item/settings-section-item.component';



const routes: Routes = [
  { path: '', component: MeComponent, pathMatch: 'full' },
  { path: 'settings', component: SettingsComponent },
  { path: 'stories', loadChildren: () => import('./stories/stories.module').then(m => m.StoriesModule) },
  { path: ':post_id', component: StoryPageComponent },
  { path: ':post_id/edit', component: EditStoryComponent, canDeactivate: [PendingChangesGuard] },
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
