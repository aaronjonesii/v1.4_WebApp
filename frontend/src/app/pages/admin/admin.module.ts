import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { SharedModule } from "../../shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { AdminStoriesComponent } from './admin-stories/admin-stories.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminFilmsComponent } from './admin-films/admin-films.component';
import { AdminFilmsAnimesComponent } from './admin-films/admin-films-animes/admin-films-animes.component';
import { AdminFilmsMoviesComponent } from './admin-films/admin-films-movies/admin-films-movies.component';
import { AdminFilmsShowsComponent } from './admin-films/admin-films-shows/admin-films-shows.component';
import { SearchMoviesComponent } from './admin-films/admin-films-movies/search-movies/search-movies.component';


const routes: Routes = [
  { path: '', component: AdminComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'stories', component: AdminStoriesComponent },
      { path: 'films', children: [
          { path: '', redirectTo: 'movies', pathMatch: 'full' },
          { path: 'animes', component: AdminFilmsAnimesComponent },
          { path: 'movies', component: AdminFilmsMoviesComponent },
          { path: 'movies/search', component: SearchMoviesComponent },
          { path: 'movies/search/:movie_query', component: SearchMoviesComponent },
          { path: 'shows', component: AdminFilmsShowsComponent },
        ] },
    ] },
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class AdminModule { }
