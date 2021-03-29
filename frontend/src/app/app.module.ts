import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HomeComponent } from './pages/home/home.component';
import { MainHeaderComponent } from './shared/layout/main-header/main-header.component';
import { StoryPageComponent } from './pages/me/stories/story-page/story-page.component';
import { HomeModule } from './pages/home/home.module';
// Import the HTTP interceptor from the Auth0 Angular SDK
import { AuthHttpInterceptor, AuthModule, HttpMethod } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { LoadingComponent } from "./shared/layout/loading/loading.component";
import { NewStoryModule } from "./pages/new-story/new-story.module";
import { NewStoryComponent } from "./pages/new-story/new-story.component";
import { StoryHeaderComponent } from "./shared/layout/story-header/story-header.component";
import { MeModule } from "./pages/me/me.module";
import { MeComponent } from "./pages/me/me.component";
import { StoriesComponent } from "./pages/me/stories/stories.component";
import { StoriesModule } from "./pages/me/stories/stories.module";
import { DraftsComponent } from "./pages/me/stories/tabs/drafts/drafts.component";
import { PublishedComponent } from "./pages/me/stories/tabs/published/published.component";
import { UnlistedComponent } from "./pages/me/stories/tabs/unlisted/unlisted.component";
import { EditStoryComponent } from "./pages/me/edit-story/edit-story.component";
import { SettingsComponent } from "./pages/me/settings/settings.component";
import { SettingsSectionComponent } from "./pages/me/settings/settings-section/settings-section.component";
import { SettingsSectionItemComponent } from "./pages/me/settings/settings-section/settings-section-item/settings-section-item.component";
import { NbToastrModule } from "@nebular/theme";
import { PublicStoryPageComponent } from './pages/public-story-page/public-story-page.component';
import { PublicStoriesListComponent } from "./pages/me/stories/public-stories-list/public-stories-list.component";
import { StatusStoriesListComponent } from "./pages/me/stories/status-stories-list/status-stories-list.component";
import { TrashComponent } from "./pages/me/stories/tabs/trash/trash.component";
import { StatusStoryComponent } from "./pages/me/stories/status-stories-list/status-story/status-story.component";

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
    SettingsComponent,
    SettingsSectionComponent,
    SettingsSectionItemComponent,
    PublicStoryPageComponent,
    PublicStoriesListComponent,
    StatusStoriesListComponent,
    StatusStoryComponent,
    TrashComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule.forRoot(),
    NbToastrModule.forRoot(),
    NbEvaIconsModule,
    HttpClientModule,

    HomeModule,
    NewStoryModule,
    MeModule,
    StoriesModule,

    AuthModule.forRoot({
      domain: environment.Auth0_domain,
      clientId: environment.Auth0_clientID,
      audience: environment.Auth0_audience,
      // scope: 'read:current_user', // Request this scope at user authentication time
      httpInterceptor: { // Specify configuration for the interceptor
        allowedList: [
          { uri: environment.apiURL + '/user/update/' },
          { uri: environment.apiURL + '/blog/*' },
        ]
      }
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
