import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { Post } from "../../../../shared/utils/blog/models/post";
import { BlogService } from "../../../../shared/utils/blog/blog.service";
import { StoriesService } from "../../../../shared/utils/stories.service";
import { takeUntil } from "rxjs/operators";
import { ExtrasService } from "../../../../shared/utils/extras.service";

/**
 * Stories Statuses:
 * Trash = 1
 * Drafts = 2
 * Pending = 3
 * Review = 4
 * Published = 5
 * Future = 6
 * Unlisted = 7
 */

@Component({
  selector: 'anon-status-stories-list',
  templateUrl: './status-stories-list.component.html',
  styleUrls: ['./status-stories-list.component.scss']
})
export class StatusStoriesListComponent implements OnInit, OnDestroy {
  @Input() statusNumber: number = 0;
  private unsub$: Subject<any> = new Subject<any>();
  stories: Post[] = [];
  filteredStories: Post[] = [];
  storiesLoaded = false;

  constructor(
    private blogService: BlogService,
    private storiesService: StoriesService,
    private extras: ExtrasService,
  ) {
    // filteredStories Subscriber
    this.storiesService.sharedFilteredStories.pipe(
      takeUntil(this.unsub$)
    ).subscribe(filteredStories => this.filteredStories = filteredStories );
    this.getStories();
  }

  ngOnInit() {}
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  // updateFilteredStories(stories) {}

  getStories() {
    this.blogService.getPosts().pipe(takeUntil(this.unsub$)).subscribe(
      stories => this.stories = stories,
      error => this.extras.showToast(error, 'Error Getting Stories', 'danger'),
      () => this.complete(),
    );
  }

  complete() {
    this.storiesLoaded = true; // Update page loading status
    // this.filteredStories = this.storiesService.filterStoriesByStatus(this.statusNumber, this.stories);
    this.storiesService.updateFilteredStories(this.storiesService.filterStoriesByStatus(this.statusNumber, this.stories))
  }

}
