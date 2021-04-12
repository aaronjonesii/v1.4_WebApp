import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HomeComponent } from './pages/home/home.component';
import { MainHeaderComponent } from './shared/layout/headers/main-header/main-header.component';
import { StoryPageComponent } from './pages/me/stories/story-page/story-page.component';
import { HomeModule } from './pages/home/home.module';
// Import the HTTP interceptor from the Auth0 Angular SDK
import { AuthHttpInterceptor, AuthModule, HttpMethod } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { LoadingComponent } from "./shared/layout/loading/loading.component";
import { NewStoryModule } from "./pages/new-story/new-story.module";
import { NewStoryComponent } from "./pages/new-story/new-story.component";
import { StoryHeaderComponent } from "./shared/layout/headers/story-header/story-header.component";
import { MeModule } from "./pages/me/me.module";
import { MeComponent } from "./pages/me/me.component";
import { StoriesComponent } from "./pages/me/stories/stories.component";
import { StoriesModule } from "./pages/me/stories/stories.module";
import { DraftsComponent } from "./pages/me/stories/tabs/drafts/drafts.component";
import { PublishedComponent } from "./pages/me/stories/tabs/published/published.component";
import { UnlistedComponent } from "./pages/me/stories/tabs/unlisted/unlisted.component";
import { EditStoryComponent } from "./pages/me/edit-story/edit-story.component";
import { ProfileSettingsComponent } from "./pages/me/profile-settings/profile-settings.component";
import { ProfileSettingsSectionComponent } from "./pages/me/profile-settings/profile-settings-section/profile-settings-section.component";
import { ProfileSettingsSectionItemComponent } from "./pages/me/profile-settings/profile-settings-section/profile-settings-section-item/profile-settings-section-item.component";
import { NbMenuModule, NbToastrModule } from "@nebular/theme";
import { PublicStoryPageComponent } from './pages/public-story-page/public-story-page.component';
import { PublicStoriesListComponent } from "./pages/public-stories-list/public-stories-list.component";
import { StatusStoriesListComponent } from "./pages/me/stories/status-stories-list/status-stories-list.component";
import { TrashComponent } from "./pages/me/stories/tabs/trash/trash.component";
import { StatusStoryComponent } from "./pages/me/stories/status-stories-list/status-story/status-story.component";
import { UserHeaderComponent } from "./shared/layout/headers/user-header/user-header.component";
import { ShowStoryStatusComponent } from "./shared/layout/headers/story-header/show-story-status/show-story-status.component";
import { StorySocialsComponent } from "./pages/me/stories/story-page/story-socials/story-socials.component";
import { StoryHeaderSettingsComponent } from "./shared/layout/headers/story-header/story-header-settings/story-header-settings.component";
import { StorySettingsComponent } from "./pages/me/stories/story-settings/story-settings.component";
import { StorySettingsSectionComponent } from "./pages/me/stories/story-settings/story-settings-section/story-settings-section.component";
import { StorySettingsSectionItemComponent } from "./pages/me/stories/story-settings/story-settings-section/story-settings-section-item/story-settings-section-item.component";
import { ServerErrorInterceptor } from "./shared/utils/server-error-interceptor";
import { ServerErrorComponent } from './pages/errors/server-error/server-error.component';
import { PageNotFoundComponent } from './pages/errors/page-not-found/page-not-found.component';
import { ConfirmationPopupComponent } from "./shared/layout/confirmation-popup/confirmation-popup.component";
import { StoryPreviewComponent } from "./shared/layout/story-preview/story-preview.component";
import { AdminModule } from "./pages/admin/admin.module";
import { AdminComponent } from "./pages/admin/admin.component";
import { AdminStoriesComponent } from "./pages/admin/admin-stories/admin-stories.component";
import { AdminDashboardComponent } from "./pages/admin/admin-dashboard/admin-dashboard.component";
import { AdminStoriesStatusListComponent } from "./pages/admin/admin-stories/admin-stories-status-list/admin-stories-status-list.component";
import { AdminDashboardQuickLinksComponent } from "./pages/admin/admin-dashboard/admin-dashboard-quick-links/admin-dashboard-quick-links.component";
import { AdminDashboardStoriesComponent } from "./pages/admin/admin-dashboard/admin-dashboard-stories/admin-dashboard-stories.component";
import { AdminFilmsComponent } from "./pages/admin/admin-films/admin-films.component";
import { AdminFilmsAnimesComponent } from "./pages/admin/admin-films/admin-films-animes/admin-films-animes.component";
import { AdminFilmsMoviesComponent } from "./pages/admin/admin-films/admin-films-movies/admin-films-movies.component";
import { AdminFilmsShowsComponent } from "./pages/admin/admin-films/admin-films-shows/admin-films-shows.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainHeaderComponent,
    StoryPageComponent,
    LoadingComponent,
    NewStoryComponent,
    StoryHeaderComponent,
    MeComponent,
    StoriesComponent,
    DraftsComponent,
    PublishedComponent,
    UnlistedComponent,
    EditStoryComponent,
    ProfileSettingsComponent,
    ProfileSettingsSectionComponent,
    ProfileSettingsSectionItemComponent,
    PublicStoryPageComponent,
    PublicStoriesListComponent,
    StatusStoriesListComponent,
    StatusStoryComponent,
    TrashComponent,
    UserHeaderComponent,
    ShowStoryStatusComponent,
    StorySocialsComponent,
    StoryHeaderSettingsComponent,
    StorySettingsComponent,
    StorySettingsSectionComponent,
    StorySettingsSectionItemComponent,
    ServerErrorComponent,
    PageNotFoundComponent,
    ConfirmationPopupComponent,
    StoryPreviewComponent,
    AdminComponent,
    AdminStoriesComponent,
    AdminDashboardComponent,
    AdminStoriesStatusListComponent,
    AdminDashboardQuickLinksComponent,
    AdminDashboardStoriesComponent,
    AdminFilmsComponent,
    AdminFilmsAnimesComponent,
    AdminFilmsMoviesComponent,
    AdminFilmsShowsComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule.forRoot(),
    NbToastrModule.forRoot(),
    NbMenuModule.forRoot(),
    NbEvaIconsModule,
    HttpClientModule,

    HomeModule,
    NewStoryModule,
    MeModule,
    StoriesModule,
    AdminModule,

    AuthModule.forRoot({
      domain: environment.Auth0_domain,
      clientId: environment.Auth0_clientID,
      audience: environment.Auth0_audience,
      httpInterceptor: { // Specify configuration for the interceptor
        allowedList: [
          { uri: environment.apiURL + '/user/update/' },
          { uri: environment.apiURL + '/blog/*' },
          {
            uri: environment.apiURL + '/frontend/admin/*',
            // tokenOptions: { scope: 'read:users_app_metadata' },
          },
        ]
      }
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
    { provide: 'Window',  useValue: window },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
