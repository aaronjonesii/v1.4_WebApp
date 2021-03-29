import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { Post } from "../../shared/utils/blog/models/post";
import * as BalloonEditor from "../../shared/utils/blog/ckeditor";
import { ActivatedRoute } from "@angular/router";
import { BlogService } from "../../shared/utils/blog/blog.service";
import { StoriesService } from "../../shared/utils/stories.service";
import { takeUntil } from "rxjs/operators";
import { ExtrasService } from "../../shared/utils/extras.service";
import { AuthService } from "@auth0/auth0-angular";

@Component({
  selector: 'anon-public-story-page',
  templateUrl: './public-story-page.component.html',
  styleUrls: ['./public-story-page.component.scss']
})
export class PublicStoryPageComponent implements OnInit, OnDestroy {
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
  menu_items: any = [{}];
  profile_json: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService,
    private storiesService: StoriesService,
    private auth: AuthService,
    private extras: ExtrasService,
  ) {
    // Get Story ID from URL
    this.activatedRoute.params.pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      routeParams => this.story.id = routeParams.post_id,
      error => console.error(error),
    );
    this.auth.user$.pipe(takeUntil(this.unsub$)).subscribe(
      profile => this.profile_json = JSON.parse(JSON.stringify(profile, null, 2)),
      error => console.error(error),
      () => {},
    );
  }

  ngOnInit() {
    this.getPost();
    // TODO: Create reporting functionality
    this.menu_items = [{ title: 'Report Story', link: `report/${this.story.id}/` }]
    setTimeout(() => this.checkIfAuthor(), 999);
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  getPost(): void {
    this.blogService.getOnePublicPost(`${this.story.id}`).pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      story => {
        this.story = story;
        this.storyMarkUp = this.storiesService.filterStoryContentMarkUp(story);
      },
      error => {
        this.extras.goBack();
      },
      () => {this.complete()}
    );
  }

  complete() {
    this.storyLoaded = true;
  }

  checkIfAuthor() {
    if(this.profile_json != null) {
      let author_id = this.profile_json.sub.replace('|', '.')
      if (author_id == this.story.author) {
        this.extras.showToast('Story owner is here!', 'Owner Detected', 'info');
        this.menu_items.push({ title: 'Edit Story', link: `me/${this.story.id}/edit` })
      }
    }
  }

}