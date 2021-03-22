import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeComponent } from './me.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";


const routes: Routes = [
  { path: '', component: MeComponent, pathMatch: 'full' },
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
