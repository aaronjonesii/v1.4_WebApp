import { Component, OnDestroy, OnInit } from '@angular/core';
import { BlogService } from '../../shared/utils/blog/blog.service';
import { Blog } from '../../shared/utils/blog/blog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'anon-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, OnDestroy {
  blogs: Blog[] = [];
  sub: Subscription;

  constructor(
    private blogService: BlogService,
  ) {
    this.sub = this.blogService.getBlogSubject().subscribe(blogs => this.blogs = blogs);
  }

  ngOnInit(): void {
    this.blogService.updateBlogSubject();
  }

    ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
