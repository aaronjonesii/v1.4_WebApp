import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { ExtrasService } from "../../../../shared/utils/services/extras.service";
import { Post } from "../../../../shared/utils/models/post";
import { BlogService } from "../../../../shared/utils/services/blog.service";

@Component({
  selector: 'anon-story-settings',
  templateUrl: './story-settings.component.html',
  styleUrls: ['./story-settings.component.scss']
})
export class StorySettingsComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  story: Post = {
    author: '',
    title: '',
    slug: '',
    content: '',
    read_time: '',
    created_on: '',
    status: 0,
  };
  storyLoaded = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private extras: ExtrasService,
    private blogService: BlogService,
  ) {
    // Get Story ID from URL
    this.activatedRoute.params.pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      routeParams => this.story.id = routeParams.post_id,
      error => this.extras.showToast(`${JSON.stringify(error)}`, 'Error', 'danger', 0),
    );
  }

  ngOnInit() { this.getPost(); }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  getPost(): void {
    this.blogService.getOnePost(`${this.story.id}`).pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      story => this.story = story,
      error => this.extras.showToast(`${JSON.stringify(error)}`, 'Error', 'danger', 0),
      () => {this.storyLoaded = true;}
    );
  }

}
