import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BlogService } from "../../../utils/services/blog.service";
import { Post } from "../../../utils/models/post";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ExtrasService } from "../../../utils/services/extras.service";
import { NbMenuService, NbPopoverDirective, NbWindowService } from "@nebular/theme";
import { Router } from "@angular/router";

@Component({
  selector: 'anon-new-story-header',
  templateUrl: './story-header.component.html',
  styleUrls: ['./story-header.component.scss'],
})
export class StoryHeaderComponent implements OnInit, OnDestroy {
  @ViewChild('storySettings', { read: TemplateRef }) storySettingsTemplate: any;
  private unsub$: Subject<any> = new Subject<any>();
  storyLoaded = false;
  autoSaveStatus = '';
  story_context_items = [
    { title: 'Story Settings' },
    { title: 'Hint and keyboard shortcuts' },
    { title: 'More help' },
    // { title: 'Change featured image' },
    // { title: 'Change display title / subtitle' },
    // { title: 'Change tags', },
  ];
  story: Post = {
    author: '',
    title: '',
    slug: '',
    content: '',
    read_time: 0,
    created_on: '',
    status: 0,
  };
  lastSavedStory!: Post;
  storyLastSavedTimestamp!: number;
  public domparser = new DOMParser();

  constructor(
    private blogService: BlogService,
    private extras: ExtrasService,
    private windowService: NbWindowService,
    private menuService: NbMenuService,
    private router: Router,
  ) { }

  ngOnInit() {
    // User Context Menu Subscriber
    this.menuService.onItemClick().pipe(
      takeUntil(this.unsub$)
    ).subscribe((event) => {
      if (event.item.title === 'Story Settings') { this.openWindowWithoutBackdrop(); }
    });
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
        // TODO: updateAutoSaveStatus('Error saving')
        if (error.status === 400) {
          if (error.error.hasOwnProperty('title')) { this.extras.showToast(`Please choose another title.`, `${error.error.title}`, 'danger');
          } else { this.extras.showToast(`${JSON.stringify(error.error)}`, 'Something went wrong', 'danger', 0); }
        }
        if (error.status === 500) {
          this.extras.showToast('Sorry we were unable to save your story, please try again later.', 'Something went wrong', 'danger', 9000);
          console.error(error.error);
        }
      },
      () => {
        this.blogService.updateAutoSaveStatus('Saved @');
        this.router.navigateByUrl(`/me/${story.id}`);
        },
    );
  }

  openWindowWithoutBackdrop() {
    this.windowService.open(
      this.storySettingsTemplate,
      {
        title: 'Story Settings',
        hasBackdrop: true,
        closeOnEsc: false,
        windowClass: 'story-header-settings',
        context: {'story': this.story}
      },
    );
  }

}
