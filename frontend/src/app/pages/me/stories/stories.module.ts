import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { StoriesComponent } from "./stories.component";
import { DraftsComponent } from "./drafts/drafts.component";
import { SharedModule } from "../../../shared/shared.module";
import { UnlistedComponent } from "./unlisted/unlisted.component";
import { PublicComponent } from "./public/public.component";

const routes: Routes = [
  { path: '', component: StoriesComponent, children: [
      { path: '', redirectTo: 'drafts', pathMatch: 'full' },
      { path: 'drafts', component: DraftsComponent },
      { path: 'public', component: PublicComponent },
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
