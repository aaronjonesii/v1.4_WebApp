import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from "../../shared/utils/models/post";
import { Subject } from "rxjs";
import { BlogService } from "../../shared/utils/services/blog.service";
import { takeUntil } from "rxjs/operators";
import { ExtrasService } from "../../shared/utils/services/extras.service";

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
    private extras: ExtrasService,
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
        this.extras.showError(error, 'getting public stories');
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
