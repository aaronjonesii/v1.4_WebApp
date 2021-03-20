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
import { HttpClientModule } from "@angular/common/http";
import { LoadingComponent } from "./shared/layout/loading/loading.component";

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

    AuthModule.forRoot({
      domain: environment.Auth0_domain,
      clientId: environment.Auth0_clientID
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
