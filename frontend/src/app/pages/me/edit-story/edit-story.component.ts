import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Post } from "../../../shared/utils/blog/models/post";
import * as BalloonEditor from "../../../shared/utils/blog/ckeditor";
import { AuthService } from "@auth0/auth0-angular";
import { BlogService } from "../../../shared/utils/blog/blog.service";
import { SlugifyPipe } from "../../../shared/utils/blog/slugify.pipe";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular";
import { ActivatedRoute, Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { Observable, Subject } from "rxjs";
import { UrlService } from "../../../shared/utils/url.service";
import { StoriesService } from "../../../shared/utils/stories.service";
import { ComponentCanDeactivate } from "../../../shared/utils/pending-changes.guard";
import { ExtrasService } from "../../../shared/utils/extras.service";

@Component({
  selector: 'anon-edit-story',
  templateUrl: './edit-story.component.html',
  styleUrls: ['./edit-story.component.scss']
})
export class EditStoryComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  private unsub$: Subject<any> = new Subject<any>();
  previousUrl!: string;
  storyLoaded = false;
  story: Post = {
    author: '',
    title: '',
    slug: '',
    content: '',
    read_time: '',
    created_on: '',
    status: 0,
  };
  storyLastSavedTimestamp!: number;
  lastSavedStory!: Post;
  public Editor = BalloonEditor;

  constructor(
    public auth: AuthService,
    private blogService: BlogService,
    private slugifyPipe: SlugifyPipe,
    private activatedRoute: ActivatedRoute,
    private urlService: UrlService,
    private router: Router,
    private storiesService: StoriesService,
    private extras: ExtrasService,
  ) {
    // liveStory Subscriber
    this.blogService.sharedLiveStory.pipe(
      takeUntil(this.unsub$)
    ).subscribe(liveStory => this.story = liveStory );
    // lastSavedStory Subscriber
    this.blogService.sharedLastSavedStory.pipe(
      takeUntil(this.unsub$)
    ).subscribe(lastSavedStory => this.lastSavedStory = lastSavedStory );
    // Get Story ID from URL
    this.activatedRoute.params.pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      routeParams => this.story.id = routeParams.post_id,
      error => console.error(error),
    );
    // URL Service Subscriber
    this.urlService.previousUrl$.pipe(
      takeUntil(this.unsub$)
    ).subscribe((previousUrl: string) => this.previousUrl = previousUrl );
    // storyLoaded Subscriber
    this.blogService.sharedStoryLoaded.pipe(
      takeUntil(this.unsub$)
    ).subscribe(isStoryLoaded => this.storyLoaded = isStoryLoaded);
    // storyLastSavedTimestamp Subscriber
    this.blogService.sharedStoryLastSavedTimestamp.pipe(
      takeUntil(this.unsub$)
    ).subscribe(storyLastSavedTimestamp => this.storyLastSavedTimestamp = storyLastSavedTimestamp);
  }

  ngOnInit() { this.getPost(<string>this.story.id); }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }
  // @HostListener allows us to also guard against browser refresh, close, etc.
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    let ret = false;
    // If story has not been saved yet this session
    if (!this.lastSavedStory.content) { ret = true; } else {
      if (this.lastSavedStory.content === this.story.content) {ret = true}
    }
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away
    return ret;
  }

  // TODO: Handle errors here
  getPost(postID: string) {
    this.blogService.getOnePost(postID).pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      story => {
        // If page came from new-story url
        if (this.previousUrl == '/new-story') {
          // If content is different from when story was created
          if (story.content != this.story.content) {
            story.content = this.story.content;
            this.updateStory(story)
          }
        }
        this.blogService.updateLiveStory(story);
      },
      error => this.extras.goBack(),
      () => {this.blogService.updateStoryLoaded(true)},
    )
  }

  updateStory(story: Post) {
    this.blogService.updateAutoSaveStatus('AutoSaving...');
    this.blogService.updateStoryLastSavedTimestamp(new Date().getTime());
    this.blogService.updatePost(story.id!, story).pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      story => {
        this.blogService.updateLastSavedStory(story);
      },
      error => {
        if (error.status === 400) {
          if (error.error.hasOwnProperty('title')) { this.extras.showToast(`Please choose another title.`, `AutoSave Failed - ${error.error.title}`, 'danger');
          } else { this.extras.showToast(`Uncaught Exception: newStory#publish\n${JSON.stringify(error.error)}`, 'AutoSave Failed - Please report this error', 'danger'); }
        }
      },
      () => {this.blogService.updateAutoSaveStatus(`Saved @`);}
    );
  }

  onChange( { editor }: ChangeEvent ) {
    this.blogService.updateLiveStory(this.storiesService.parseEditorContent(editor, this.story));
    // If story has already been saved
    if (this.storyLastSavedTimestamp) {
      const postLastSavedSeconds = this.checkSeconds(this.storyLastSavedTimestamp)
      // If story has been saved more than 5 seconds ago
      if (postLastSavedSeconds > 5) { this.updateStory(this.story); }
    } else { this.updateStory(this.story); }
  }

  checkSeconds(storylastSavedTimestamp: any) {
    const current_time = new Date();
    return (current_time.getTime() - storylastSavedTimestamp) / 1000
  }

}
