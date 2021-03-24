import { Component, OnDestroy, OnInit } from '@angular/core';
import * as BalloonEditor from '../../shared/utils/blog/ckeditor';
import { ChangeEvent } from "@ckeditor/ckeditor5-angular";
import { BlogService } from "../../shared/utils/blog/blog.service";
import { Post } from "../../shared/utils/blog/models/post";
import { SlugifyPipe } from "../../shared/utils/blog/slugify.pipe";
import { AuthService } from "@auth0/auth0-angular";
import { Router } from "@angular/router";
import { StoriesService } from "../../shared/utils/stories.service";
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
    read_time: '',
    created_on: '',
    status: 0,
  };
  storyLastSavedTimestamp!: number;
  changes = 0
  status = 'Not Saved';
  public Editor = BalloonEditor;
  editorConfig = {
    title: { placeholder: 'Title' },
    placeholder: 'Tell your story...',
  };

  constructor(
    public auth: AuthService,
    private blogService: BlogService,
    private slugifyPipe: SlugifyPipe,
    private router: Router,
    private storiesService: StoriesService,
  ) { }

  ngOnInit() {
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
    this.story = this.storiesService.parseEditorContent(editor, this.story);
    // TODO: Caculate read time from word count
    this.story.read_time = "0";
    // TODO: Provide options to user for statuses
    this.story.status = 2;
    // Update saved story
    this.blogService.updateSavedNewStory(this.story);
    // If there have been more than 5 changes and the title is more than 5 characters
    if ((this.changes >= 5) && (this.story.title.replace('&nbsp;', '').length >= 5)) {
      if (this.storyLastSavedTimestamp) {
        const postLastSavedSeconds = this.checkSeconds(this.storyLastSavedTimestamp)
        // If story has been saved more than 5 seconds ago
        if (postLastSavedSeconds > 5) {
          this.publish(this.story);
        } else { console.info('newStory#onChange story was update within last 5 seconds, autosave will save soon'); }
      } else { this.publish(this.story); }
    }
    this.changes++
  }

  publish(post: Post) {
    this.blogService.updateAutoSaveStatus('AutoSaving...');
    this.blogService.updateStoryLastSavedTimestamp(new Date().getTime());
    this.blogService.createPost(post).subscribe(
      story => {
        this.router.navigateByUrl(`me/${story.id}/edit`);
        this.blogService.updateSavedNewStory(story);
      },
      error => {
        if (error.status === 400) { console.error('Bad Request: ', error.error);
          if (error.error.hasOwnProperty('title')) { console.error('Error', error.error.title);
          } else { alert(`Uncaught Exception: CreatePost#create\n${JSON.stringify(error.error)}`); }
          // console.error('Error occurred during post creation: ', error);
        }
        if (error.status === 500) { alert(`Internal Server Error: CreatePost#create\n${error.error}`); }
        // TODO: Create Appealing Error Page
      },
      () => {this.blogService.updateAutoSaveStatus(`Saved @ ${this.storyLastSavedTimestamp}`);}
    )
  }

  checkSeconds(storylastSavedTimestamp: any) {
    const current_time = new Date();
    return (current_time.getTime() - storylastSavedTimestamp) / 1000
  }

}
