import { Component, OnDestroy, OnInit } from '@angular/core';
import { BlogService } from '../../shared/utils/blog/blog.service';
import { Subject, Subscription } from 'rxjs';
import { Blog } from '../../shared/utils/blog/models/blog';
import { AuthService } from "@auth0/auth0-angular";
import { Post } from "../../shared/utils/blog/models/post";
import { takeUntil } from "rxjs/operators";
import { StoriesService } from "../../shared/utils/stories.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  blogs: Blog[] = [];
  publicStories!: Post[];
  storiesLoaded = false;
  sub: Subscription;
  tags = [
    'Technology',
    'Future',
    'Health',
    'Science',
    'Business',
    'Work',
    'Culture',
    'Programming',
    'Design',
    'Productivity',
    'Cryptocurrency',
    'Artificial Intelligence',
    'Computers',
    'Operating Systems'
  ];

  constructor(
    private blogService: BlogService,
    private storiesService: StoriesService,
    public auth: AuthService,
  ) {

    this.sub = this.blogService.getBlogSubject().subscribe(blogs => this.blogs = blogs);
  }

  ngOnInit() {
    this.blogService.updateBlogSubject();
    this.getPublicStories();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.unsub$.next();
    this.unsub$.complete();
  }

  getPublicStories() {
    this.blogService.getPublicPosts().pipe(takeUntil(this.unsub$)).subscribe(
      stories => {
        this.publicStories = stories;
      },
      error => {
        // TODO: exclude public page request from HTTPINTERCEPTOR
        console.error(error);
        this.publicStories = [];
        this.storiesLoaded = true;
      },
      () => this.complete(),
    );
  }

  complete() {
    this.storiesLoaded = true;
  }

}
