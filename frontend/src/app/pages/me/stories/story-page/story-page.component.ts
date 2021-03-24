import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Blog } from '../../../../shared/utils/blog/models/blog';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../../../shared/utils/blog/blog.service';
import { Location } from '@angular/common';
import { Post } from "../../../../shared/utils/blog/models/post";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import * as BalloonEditor from "../../../../shared/utils/blog/ckeditor";
import { StoriesService } from "../../../../shared/utils/stories.service";

@Component({
  selector: 'anon-blog-post',
  templateUrl: './story-page.component.html',
  styleUrls: ['./story-page.component.scss']
})
export class StoryPageComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  @Input() story: Post = {
    author: '',
    title: '',
    slug: '',
    content: '',
    read_time: '',
    created_on: '',
    status: 0,
  };
  storyMarkUp = '';
  storyLoaded = false;
  public Editor = BalloonEditor;
  menu_items: any = [{ title: 'Edit Blog Post' }];

  constructor(
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService,
    private storiesService: StoriesService,
    private location: Location,
  ) {
    // Get Story ID from URL
    this.activatedRoute.params.pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      routeParams => this.story.id = routeParams.post_id,
      error => console.error(error),
    );
  }

  ngOnInit() {
    this.getPost();
    this.menu_items = [{ title: 'Edit Story', link: `me/${this.story.id}/edit` }]
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  getPost(): void {
    this.blogService.getOnePost(`${this.story.id}`).pipe(
     takeUntil(this.unsub$)
    ).subscribe(
      story => {
        this.story = story;
        this.storyMarkUp = this.storiesService.filterStoryContentMarkUp(story);
      },
      error => console.error(error),
      () => {this.complete()}
    );
  }

  complete() {
    this.storyLoaded = true;
  }

  goBack(): void {
    this.location.back();
  }

}
