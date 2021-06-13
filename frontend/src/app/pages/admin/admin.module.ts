import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { SharedModule } from "../../shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { AdminStoriesComponent } from './admin-stories/admin-stories.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminFilmsComponent } from './admin-films/admin-films.component';
import { AdminFilmsMoviesComponent } from './admin-films/admin-films-movies/admin-films-movies.component';
import { AdminFilmsShowsComponent } from './admin-films/admin-films-shows/admin-films-shows.component';
import { SearchMoviesComponent } from './admin-films/admin-films-movies/search-movies/search-movies.component';
import { AdminCryptoComponent } from './admin-crypto/admin-crypto.component';
import { AdminCryptoBsctokensComponent } from './admin-crypto/admin-crypto-bsctokens/admin-crypto-bsctokens.component';
import { AdminCryptoTokensComponent } from "./admin-crypto/admin-crypto-tokens/admin-crypto-tokens.component";
import { CryptoTokenPageComponent } from './admin-crypto/crypto-token-page/crypto-token-page.component';
import { EditCryptoTokenComponent } from './admin-crypto/edit-crypto-token/edit-crypto-token.component';
import { CryptoTrashedTokensComponent } from './admin-crypto/crypto-trashed-tokens/crypto-trashed-tokens.component';
import { CryptoArchivedTokensComponent } from './admin-crypto/crypto-archived-tokens/crypto-archived-tokens.component';
import { CryptoWalletsComponent } from './admin-crypto/crypto-wallets/crypto-wallets.component';
import { CryptoWalletComponent } from './admin-crypto/crypto-wallets/crypto-wallet/crypto-wallet.component';
import { CreateCryptoWalletComponent } from "./admin-crypto/crypto-wallets/create-crypto-wallet/create-crypto-wallet.component";
import { EditCryptoWalletComponent } from "./admin-crypto/crypto-wallets/edit-crypto-wallet/edit-crypto-wallet.component";


const routes: Routes = [
  { path: '', component: AdminComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'crypto', children: [
          { path: '', component: AdminCryptoComponent, pathMatch: 'full' },
          { path: 'tokens', component: AdminCryptoTokensComponent },
          { path: 'token/:token_id', component: CryptoTokenPageComponent },
          { path: 'token/:token_id/edit', component: EditCryptoTokenComponent },
          { path: 'bsc-tokens', component: AdminCryptoBsctokensComponent },
          { path: 'trashed-tokens', component: CryptoTrashedTokensComponent },
          { path: 'archived-tokens', component: CryptoArchivedTokensComponent },
          { path: 'wallets', component: CryptoWalletsComponent },
          { path: 'wallets/dashboard', component: CryptoWalletComponent },
          { path: 'wallet/:wallet_address', component: CryptoWalletComponent },
          { path: 'create-wallet', component: CreateCryptoWalletComponent },
          { path: 'edit-wallet/:wallet_address', component: EditCryptoWalletComponent },
        ] },
      { path: 'stories', component: AdminStoriesComponent },
      { path: 'films', children: [
          { path: '', component: AdminFilmsComponent, pathMatch: 'full' },
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
