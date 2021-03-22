import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewStoryComponent } from './new-story.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";


const routes: Routes = [
  { path: '', component: NewStoryComponent, pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class NewStoryModule { }
