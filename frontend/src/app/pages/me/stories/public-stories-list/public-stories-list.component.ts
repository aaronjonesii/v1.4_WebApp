import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from "../../../../shared/utils/blog/models/post";
import { Subject } from "rxjs";
import { BlogService } from "../../../../shared/utils/blog/blog.service";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'anon-public-stories-list',
  templateUrl: './public-stories-list.component.html',
  styleUrls: ['./public-stories-list.component.scss']
})
export class PublicStoriesListComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  publicStories!: Post[];
  storiesLoaded = false;


  constructor(
    private blogService: BlogService,
  ) { }

  ngOnInit() {
    this.getPublicStories();
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  getPublicStories() {
    this.blogService.getPublicPosts().pipe(takeUntil(this.unsub$)).subscribe(
      stories => { this.publicStories = stories; },
      error => {
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
