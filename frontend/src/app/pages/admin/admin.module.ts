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
import { AdminCryptoComponent } from './admin-crypto/admin-crypto.component';
import { AdminCryptoBsctokensComponent } from './admin-crypto/admin-crypto-bsctokens/admin-crypto-bsctokens.component';
import { AdminCryptoTokensComponent } from "./admin-crypto/admin-crypto-tokens/admin-crypto-tokens.component";
import { CreateTokenStepComponent } from './admin-crypto/create-cryptotoken/create-token-step/create-token-step.component';
import { CryptoTokenPageComponent } from './admin-crypto/crypto-token-page/crypto-token-page.component';
import { EditCryptoTokenComponent } from './admin-crypto/edit-crypto-token/edit-crypto-token.component';
import { CryptoTokenCardComponent } from './admin-crypto/admin-crypto-token-cards/crypto-token-card/crypto-token-card.component';


const routes: Routes = [
  { path: '', component: AdminComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'crypto', children: [
          { path: '', component: AdminCryptoComponent, pathMatch: 'full' },
          { path: 'tokens', component: AdminCryptoTokensComponent },
          { path: 'token/:token_id', component: CryptoTokenPageComponent },
          // { path: 'token/:token_id/edit', component:  },
          { path: 'bsctokens', component: AdminCryptoBsctokensComponent },
        ] },
      { path: 'stories', component: AdminStoriesComponent },
      { path: 'films', children: [
          { path: '', component: AdminFilmsComponent, pathMatch: 'full' },
          { path: 'animes', component: AdminFilmsAnimesComponent },
          { path: 'movies', component: AdminFilmsMoviesComponent },
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
