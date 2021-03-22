import { Component, OnDestroy, OnInit } from '@angular/core';
import * as BalloonEditor from '../../shared/utils/blog/ckeditor';
import { ChangeEvent } from "@ckeditor/ckeditor5-angular";
import { BlogService } from "../../shared/utils/blog/blog.service";
import { Post } from "../../shared/utils/blog/models/post";
import { SlugifyPipe } from "../../shared/utils/blog/slugify.pipe";
import { AuthService } from "@auth0/auth0-angular";
import { Router } from "@angular/router";

@Component({
  selector: 'anon-new-story',
  templateUrl: './new-story.component.html',
  styleUrls: ['./new-story.component.scss'],
})
export class NewStoryComponent implements OnInit, OnDestroy {
  post: Post = {
    author: '',
    title: '',
    slug: '',
    content: '',
    read_time: '',
    created_on: '',
    status: 0,
  };
  changes = 0
  status = '';
  public Editor = BalloonEditor;
  editorConfig = {
    title: { placeholder: 'Title' },
    placeholder: 'Tell your story...',
  };
  public domparser = new DOMParser();

  constructor(
    public auth: AuthService,
    private blogService: BlogService,
    private slugifyPipe: SlugifyPipe,
    private router: Router,
  ) { }

  ngOnInit() { }
  ngOnDestroy() { }

  public onChange( { editor }: ChangeEvent ) {
    const htmlString = editor.getData();
    const domDoc = this.domparser.parseFromString(htmlString, 'text/html')
    this.post.content = htmlString;
    if(domDoc.getElementsByTagName("h1").length > 0) {
      this.post.title = domDoc.getElementsByTagName("h1")[0].innerHTML;
      this.post.slug = this.slugifyPipe.transform(domDoc.getElementsByTagName("h1")[0].innerText);
    }
    if(domDoc.getElementsByClassName('ck-subtitle').length > 0) {
      this.post.byline = domDoc.getElementsByClassName('ck-subtitle')[0].innerHTML;
    }
    this.post.read_time = "0";
    this.post.status = 1;
    // TODO: Create draft for user with new edits
    this.blogService.nextNewStory(this.post);
    // TODO: Find better way to manage multiple posts being create on changes
    if ((this.changes >= 5) && (this.post.title.replace('&nbsp;', '').length >= 5)) { this.publish(this.post); }
    this.changes++
  }

  publish(post: Post) {
    console.warn(post);
    this.blogService.createPost(post).subscribe(
      story => {
        this.router.navigateByUrl(`me/${story.id}/edit`);
        this.status = 'Saved';
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
    )
  }

}
