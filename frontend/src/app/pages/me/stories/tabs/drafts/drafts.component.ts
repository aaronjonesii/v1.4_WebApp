import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from "../../../../../shared/utils/blog/models/post";
import { BlogService } from "../../../../../shared/utils/blog/blog.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { StoriesService } from "../../../../../shared/utils/stories.service";

@Component({
  selector: 'anon-drafts',
  templateUrl: './drafts.component.html',
  styleUrls: ['./drafts.component.scss']
})
export class DraftsComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  stories: Post[] = [];
  drafts: Post[] = [];

  constructor(
    private blogService: BlogService,
    private storiesService: StoriesService,
  ) {  }

  ngOnInit() { }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

}
