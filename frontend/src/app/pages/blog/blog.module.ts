import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogComponent } from './blog.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlogPostComponent } from './blog-post/blog-post.component';
import { PostsHeroComponent } from './posts-hero/posts-hero.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { EditBlogPostComponent } from './edit-blog-post/edit-blog-post.component';

const routes: Routes = [
  { path: '', component: BlogComponent, pathMatch: 'full' },
  { path: 'post/:id', component: BlogPostComponent },
  { path: 'post/:id/edit', component: EditBlogPostComponent}
];

@NgModule({
    declarations: [BlogListComponent],
    exports: [
        BlogListComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
    ]
})
export class BlogModule { }
