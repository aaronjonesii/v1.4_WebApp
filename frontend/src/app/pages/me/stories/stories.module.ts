import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { StoriesComponent } from "./stories.component";
import { DraftsComponent } from "./tabs/drafts/drafts.component";
import { SharedModule } from "../../../shared/shared.module";
import { UnlistedComponent } from "./tabs/unlisted/unlisted.component";
import { PublishedComponent } from "./tabs/published/published.component";
import { TrashComponent } from './tabs/trash/trash.component';
import { StorySettingsSectionComponent } from './story-settings/story-settings-section/story-settings-section.component';
import { StorySettingsSectionItemComponent } from './story-settings/story-settings-section/story-settings-section-item/story-settings-section-item.component';

const routes: Routes = [
  { path: '', component: StoriesComponent, children: [
      { path: '', redirectTo: 'drafts', pathMatch: 'full' },
      { path: 'drafts', component: DraftsComponent },
      { path: 'published', component: PublishedComponent },
      { path: 'trash', component: TrashComponent },
      { path: 'unlisted', component: UnlistedComponent },
    ] },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class StoriesModule { }
