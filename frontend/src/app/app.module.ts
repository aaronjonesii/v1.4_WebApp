import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ProfileComponent } from './pages/profile/profile.component';
import { PostsHeroComponent } from './pages/blog/posts-hero/posts-hero.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import { BlogPostComponent } from './pages/blog/blog-post/blog-post.component';
import { HomeModule } from './pages/home/home.module';
import { ProfileModule } from './pages/profile/profile.module';
import { BlogModule } from './pages/blog/blog.module';
import { BlogComponent } from './pages/blog/blog.component';
import { EditBlogPostComponent } from './pages/blog/edit-blog-post/edit-blog-post.component';

import { AuthModule } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

// Import the HTTP interceptor from the Auth0 Angular SDK
import { AuthHttpInterceptor } from '@auth0/auth0-angular';
import { LoadingComponent } from "./shared/layout/loading/loading.component";
import { NewStoryModule } from "./pages/new-story/new-story.module";
import { NewStoryComponent } from "./pages/new-story/new-story.component";
import { NewStoryHeaderComponent } from "./shared/layout/new-story-header/new-story-header.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    PostsHeroComponent,
    ProfileComponent,
    BlogPostComponent,
    BlogComponent,
    EditBlogPostComponent,
    LoadingComponent,
    NewStoryComponent,
    NewStoryHeaderComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule.forRoot(),
    NbEvaIconsModule,
    HttpClientModule,

    HomeModule,
    ProfileModule,
    BlogModule,
    NewStoryModule,

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
