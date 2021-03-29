import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from "../../../../../shared/utils/blog/models/post";
import { Subject } from "rxjs";
import { BlogService } from "../../../../../shared/utils/blog/blog.service";
import { StoriesService } from "../../../../../shared/utils/stories.service";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'anon-unlisted',
  templateUrl: './unlisted.component.html',
  styleUrls: ['./unlisted.component.scss']
})
export class UnlistedComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  stories: Post[] = [];
  unlistedStories!: Post[];
  storiesLoaded = false;

  constructor(
    private blogService: BlogService,
    private storiesService: StoriesService,
  ) { this.getStories(); }

  ngOnInit() { }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  getStories() {
    this.blogService.getPosts().pipe(takeUntil(this.unsub$)).subscribe(
      stories => this.stories = stories,
      error => console.error(error),
      () => this.complete(),
    );
  }

  complete() {
    this.storiesLoaded = true; // Update page loading status
    this.unlistedStories = this.storiesService.filterStoriesByStatus(7, this.stories);
  }

}
