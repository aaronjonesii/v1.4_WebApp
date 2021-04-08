import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { Post } from "../../../shared/utils/models/post";
import { BlogService } from "../../../shared/utils/services/blog.service";
import { takeUntil } from "rxjs/operators";
import { StoriesService } from "../../../shared/utils/services/stories.service";

@Component({
  selector: 'anon-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  is_stories_loaded = false;
  all_stories: Post[] = [];

  constructor(
    private blogService: BlogService,
    private storiesService: StoriesService,
    ) { }

  ngOnInit() {
    this.get_all_stories();
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  get_all_stories() {
    this.blogService.adminGetAllStories().pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      (all_stories: Post[]) => this.all_stories = all_stories,
      error => { this.is_stories_loaded = false; },
      () => { this.is_stories_loaded = true;this.storiesService.sort_stories_by_date(this.all_stories,'updated_on', 'descending'); }
    );
  }

}
