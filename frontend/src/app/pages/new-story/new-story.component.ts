import { Component, OnDestroy, OnInit } from '@angular/core';
import * as BalloonEditor from '../../shared/utils/CustomBalloonEditor/ckeditor';
import { ChangeEvent } from "@ckeditor/ckeditor5-angular";
import { BlogService } from "../../shared/utils/services/blog.service";
import { Post } from "../../shared/utils/models/post";
import { SlugifyPipe } from "../../shared/utils/pipes/slugify.pipe";
import { AuthService } from "@auth0/auth0-angular";
import { Router } from "@angular/router";
import { StoriesService } from "../../shared/utils/services/stories.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: 'anon-new-story',
  templateUrl: './new-story.component.html',
  styleUrls: ['./new-story.component.scss'],
})
export class NewStoryComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  story: Post = {
    author: '',
    title: '',
    slug: '',
    content: '',
    read_time: 0,
    created_on: '',
    status: 0,
  };
  storyLastSavedTimestamp!: number;
  changes = 0
  status = 'Not Saved';
  public Editor = BalloonEditor;
  storyCharacterCount: number = 0;
  storyWordCount: number = 0;
  editorConfig = {
    title: { placeholder: 'Title' },
    placeholder: 'Tell your story...',
    wordCount: {
      onUpdate: (stats:any) => {
        this.storyCharacterCount = stats.characters;
        this.storyWordCount = stats.words;
      }
    },
  };

  constructor(
    public auth: AuthService,
    private blogService: BlogService,
    private slugifyPipe: SlugifyPipe,
    private router: Router,
    private storiesService: StoriesService,
  ) {
    // Reset Status in story header
    this.blogService.updateLiveStory(this.story);
    // Reset AutoSave time in story header
    this.blogService.updateAutoSaveStatus('');
  }

  ngOnInit() {
    // liveStory Subscriber
    this.blogService.sharedLiveStory.pipe(
      takeUntil(this.unsub$)
    ).subscribe(liveStory => this.story = liveStory );
    // storyLastSavedTimestamp Subscriber
    this.blogService.sharedStoryLastSavedTimestamp.pipe(
      takeUntil(this.unsub$)
    ).subscribe(storyLastSavedTimestamp => this.storyLastSavedTimestamp = storyLastSavedTimestamp);
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  public onChange( { editor }: ChangeEvent ) {
    this.blogService.updateLiveStory(this.storiesService.parseEditorContent(editor, this.story, this.storyWordCount));
    // If there have been more than 5 changes and the title is more than 5 characters
    if ((this.changes >= 5) && (this.story.title.replace('&nbsp;', '').length >= 5)) {
      if (this.storyLastSavedTimestamp) {
        const postLastSavedSeconds = this.checkSeconds(this.storyLastSavedTimestamp)
        // If story has been saved more than 5 seconds ago
        if (postLastSavedSeconds > 5) {
          this.saveDraft(this.story);
        } else { return; }
      } else { this.saveDraft(this.story); }
    }
    this.changes++
  }

  saveDraft(story: Post) {
    this.blogService.updateAutoSaveStatus('AutoSaving...');
    this.blogService.updateStoryLastSavedTimestamp(new Date().getTime());
    story.status = 2 // Set Status to Draft
    this.blogService.createPost(story).subscribe(
      story => {
        this.router.navigateByUrl(`me/${story.id}/edit`);
        this.blogService.updateLastSavedStory(story);
      },
      error => { this.blogService.updateAutoSaveStatus('Error saving...'); },
      () => {this.blogService.updateAutoSaveStatus(`Saved @ ${this.storyLastSavedTimestamp}`);}
    )
  }

  checkSeconds(storyLastSavedTimestamp: any) {
    const current_time = new Date();
    return (current_time.getTime() - storyLastSavedTimestamp) / 1000
  }

}
