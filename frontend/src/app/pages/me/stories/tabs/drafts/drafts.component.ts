import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from "../../../../../shared/utils/models/post";
import { BlogService } from "../../../../../shared/utils/services/blog.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { StoriesService } from "../../../../../shared/utils/services/stories.service";

@Component({
  selector: 'anon-drafts',
  templateUrl: './drafts.component.html',
  styleUrls: ['./drafts.component.scss']
})
export class DraftsComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();

  constructor() { }

  ngOnInit() { }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

}
