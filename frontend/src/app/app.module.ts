import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ProfileComponent } from './pages/profile/profile.component';
import { HomeComponent } from './pages/home/home.component';
import { MainHeaderComponent } from './shared/layout/main-header/main-header.component';
import { StoryPageComponent } from './pages/me/stories/story-page/story-page.component';
import { HomeModule } from './pages/home/home.module';
import { ProfileModule } from './pages/profile/profile.module';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

// Import the HTTP interceptor from the Auth0 Angular SDK
import { AuthHttpInterceptor } from '@auth0/auth0-angular';
import { LoadingComponent } from "./shared/layout/loading/loading.component";
import { NewStoryModule } from "./pages/new-story/new-story.module";
import { NewStoryComponent } from "./pages/new-story/new-story.component";
import { StoryHeaderComponent } from "./shared/layout/story-header/story-header.component";
import { MeModule } from "./pages/me/me.module";
import { MeComponent } from "./pages/me/me.component";
import { StoriesComponent } from "./pages/me/stories/stories.component";
import { StoriesModule } from "./pages/me/stories/stories.module";
import { DraftsComponent } from "./pages/me/stories/drafts/drafts.component";
import { PublicComponent } from "./pages/me/stories/public/public.component";
import { UnlistedComponent } from "./pages/me/stories/unlisted/unlisted.component";
import { EditStoryComponent } from "./pages/me/edit-story/edit-story.component";
import { SettingsComponent } from "./pages/me/settings/settings.component";
import { SettingsSectionComponent } from "./pages/me/settings/settings-section/settings-section.component";
import { SettingsSectionItemComponent } from "./pages/me/settings/settings-section/settings-section-item/settings-section-item.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainHeaderComponent,
    ProfileComponent,
    StoryPageComponent,
    LoadingComponent,
    NewStoryComponent,
    StoryHeaderComponent,
    MeComponent,
    StoriesComponent,
    DraftsComponent,
    PublicComponent,
    UnlistedComponent,
    EditStoryComponent,
    SettingsComponent,
    SettingsSectionComponent,
    SettingsSectionItemComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule.forRoot(),
    NbEvaIconsModule,
    HttpClientModule,

    HomeModule,
    ProfileModule,
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
          {
            // Match any request that starts with (note the asterisk)
            uri: environment.apiURL + '*',
            tokenOptions: {
              audience: environment.Auth0_audience, // The attached token should target this audience
              // scope: 'read:current_user' // The attached token should have these scopes
            }
          }
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
