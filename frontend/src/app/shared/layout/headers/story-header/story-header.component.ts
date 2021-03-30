import { Component, OnDestroy, OnInit } from '@angular/core';
import { BlogService } from "../../../utils/blog/blog.service";
import { Post } from "../../../utils/blog/models/post";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: 'anon-new-story-header',
  templateUrl: './story-header.component.html',
  styleUrls: ['./story-header.component.scss'],
})
export class StoryHeaderComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  storyLoaded = false;
  autoSaveStatus = '';
  story_context_items = [
    { title: 'Change featured image' },
    { title: 'Change display title / subtitle' },
    { title: 'Change tags', },
  ];
  story: Post = {
    author: '',
    title: '',
    slug: '',
    content: '',
    read_time: '',
    created_on: '',
    status: 0,
  };
  lastSavedStory!: Post;
  storyLastSavedTimestamp!: number;
  public domparser = new DOMParser();

  constructor(
    private blogService: BlogService,
  ) { }

  ngOnInit() {
    // liveStory Subscriber
    this.blogService.sharedLiveStory.pipe(
      takeUntil(this.unsub$)
    ).subscribe(liveStory => this.story = liveStory );
    // lastSavedStory Subscriber
    this.blogService.sharedLastSavedStory.pipe(
      takeUntil(this.unsub$)
    ).subscribe(lastSavedStory => this.lastSavedStory = lastSavedStory );
    // AutoSave Status Subscriber
    this.blogService.sharedAutoSaveStatus.pipe(
      takeUntil(this.unsub$)
    ).subscribe(autoSaveStatus => this.autoSaveStatus = autoSaveStatus);
    // storyLoaded Subscriber
    this.blogService.sharedStoryLoaded.pipe(
      takeUntil(this.unsub$)
    ).subscribe(isStoryLoaded => this.storyLoaded = isStoryLoaded);
    // storyLastSavedTimestamp Subscriber
    this.blogService.sharedStoryLastSavedTimestamp.pipe(
      takeUntil(this.unsub$)
    ).subscribe(storyLastSavedTimestamp => this.storyLastSavedTimestamp = storyLastSavedTimestamp);
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  saveStory(story: Post) {
    this.blogService.updateAutoSaveStatus('Saving...');
    this.blogService.updateStoryLastSavedTimestamp(new Date().getTime());
    this.blogService.updatePost(story.id!, story).pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      story => {
        this.blogService.updateLastSavedStory(story);
        },
      error => {
        // TODO: create handleErrors function in blog.service
        // TODO: updateAutoSaveStatus('Error saving')
        // TODO: Create Toastr for error messages
        if (error.status === 400) { console.error('Bad Request: ', error.error);
          if (error.error.hasOwnProperty('title')) { console.error('Error', error.error.title);
          } else { alert(`Uncaught Exception: newStory#publish\n${JSON.stringify(error.error)}`); }
          // console.error('Error occurred during post creation: ', error);
        }
        if (error.status === 500) { alert(`Internal Server Error: newStory#publish\n${error.error}`); }
        // TODO: Create Appealing Error Page
      },
      () => {this.blogService.updateAutoSaveStatus('Saved @');},
    )
  }

}
