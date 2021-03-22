import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from "../../../../shared/utils/blog/models/post";
import { BlogService } from "../../../../shared/utils/blog/blog.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'anon-drafts',
  templateUrl: './drafts.component.html',
  styleUrls: ['./drafts.component.scss']
})
export class DraftsComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  stories: Post[] = [];
  pageLoaded = false;

  constructor(private blogService: BlogService) { }

  ngOnInit() {
    this.getStories();
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  getStories() {
    this.blogService.getPosts().pipe(takeUntil(this.unsub$)).subscribe(
      response => this.stories = response,
      error => console.error(error),
      () => this.pageLoaded = true, // Update page loading status
    );
  }

}
