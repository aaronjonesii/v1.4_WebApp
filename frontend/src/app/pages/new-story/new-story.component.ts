import { Component, OnDestroy, OnInit } from '@angular/core';
import * as BalloonEditor from '../../shared/utils/blog/ckeditor';
import { ChangeEvent } from "@ckeditor/ckeditor5-angular";
import { BlogService } from "../../shared/utils/blog/blog.service";
import { Post } from "../../shared/utils/blog/models/post";
import { SlugifyPipe } from "../../shared/utils/blog/slugify.pipe";
import { AuthService } from "@auth0/auth0-angular";

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
  ) { }

  ngOnInit() { }
  ngOnDestroy() { }

  public onChange( { editor }: ChangeEvent ) {
    const htmlString = editor.getData();
    const domDoc = this.domparser.parseFromString(htmlString, 'text/html')
    this.post.content = htmlString;
    if(domDoc.getElementsByTagName("h1").length > 0) {
      this.post.title = domDoc.getElementsByTagName("h1")[0].outerHTML;
      this.post.slug = this.slugifyPipe.transform(domDoc.getElementsByTagName("h1")[0].innerText);
    }
    if(domDoc.getElementsByClassName('ck-subtitle').length > 0) {
      this.post.byline = domDoc.getElementsByClassName('ck-subtitle')[0].outerHTML;
    }
    this.post.read_time = "0";
    this.post.status = 1;
    // TODO: Create draft for user with new edits
    this.blogService.nextNewStory(this.post);
  }

}
