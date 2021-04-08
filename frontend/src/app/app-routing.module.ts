import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { PublicStoryPageComponent } from "./pages/public-story-page/public-story-page.component";
import { PageNotFoundComponent } from "./pages/errors/page-not-found/page-not-found.component";
import { ServerErrorComponent } from "./pages/errors/server-error/server-error.component";


const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'error', component: ServerErrorComponent },
  { path: 'admin', loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuard] },
  { path: 'me', loadChildren: () => import('./pages/me/me.module').then(m => m.MeModule), canActivate: [AuthGuard] },
  { path: 'new-story', loadChildren: () => import('./pages/new-story/new-story.module').then(m => m.NewStoryModule), canActivate: [AuthGuard] },
  { path: 'public/:post_id', component: PublicStoryPageComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
