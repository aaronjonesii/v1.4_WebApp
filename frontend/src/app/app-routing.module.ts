import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { PublicStoryPageComponent } from "./pages/public-story-page/public-story-page.component";


const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'me', loadChildren: () => import('./pages/me/me.module').then(m => m.MeModule), canActivate: [AuthGuard] },
  { path: 'new-story', loadChildren: () => import('./pages/new-story/new-story.module').then(m => m.NewStoryModule), canActivate: [AuthGuard] },
  { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuard] },
  { path: 'public/:post_id', component: PublicStoryPageComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
